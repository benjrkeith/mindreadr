import { Router } from 'express'
import pg from 'pg'

import db from '../db.js'
import likesRouter from './likes.js'
import repliesRouter from './replies.js'
import verifyToken from '../middleware/verifyToken.js'
import getPost from '../middleware/getPost.js'
import checkPrivilege from '../middleware/checkPrivilege.js'
import parseLimits from '../middleware/parseLimits.js'
import getFollowing from '../middleware/getFollowing.js'

const router = Router()

router.use(verifyToken)
router.use('/:key/likes', likesRouter)
router.use('/:key/replies', repliesRouter)

// get all posts, supports by author and offset/limit
router.get('/', parseLimits, getFollowing, async (req, res) => {
  const { author, following = false } = req.query
  const { offset, limit, user, _following } = res.locals

  // the where clause allows postgres to evaluate whether to filter by a
  // specific author, by the list of people you follow, or just all posts
  // if author is specified, and following=true, it will only return posts
  // if you follow the specific author
  const query = {
    text: `SELECT key, author, content, created_at, parent,
      (SELECT avatar FROM users WHERE username=author) AS author_avatar,
      (SELECT author AS parent_author FROM POSTS AS s WHERE s.key=p.parent),
      EXISTS(SELECT * FROM posts AS n WHERE n.author=$3 AND n.parent=p.key AND n.content=p.content) AS reposted,
      (SELECT COUNT(*)::int AS reposts FROM posts WHERE parent=p.key AND content=p.content),
      EXISTS(SELECT * FROM posts AS n WHERE n.author=$3 AND n.parent=p.key AND NOT n.content=p.content) AS replied,
      (SELECT COUNT(*)::int AS replies FROM posts WHERE parent=p.key AND NOT content=p.content),
      (SELECT COUNT(*)::int AS likes FROM likes WHERE post=key), 
      EXISTS(SELECT * FROM likes WHERE username=$3 AND post=key) AS liked 
      FROM posts AS p WHERE ($4::text IS NULL AND ($6 IS FALSE OR author=ANY($5)) 
      OR (author=$4 AND $4=ANY($5)) OR (author=$4 AND $6 IS FALSE))
      ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    values: [limit, offset, user.username, author, _following, following]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// create a new post
router.post('/', async (req, res) => {
  const { content = '', parent = null } = req.body
  if (content === '' || content.length < 3) {
    res.status(400).send({ err: 'Content must be longer than 3 chars.' })
    return
  }

  const query = {
    text: 'INSERT INTO posts(author, content, parent) VALUES($1, $2, $3) RETURNING *',
    values: [res.locals.user.username, content, parent]
  }

  try {
    const result = await db.query(query)
    res.status(201).send(result.rows[0])
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// get trending posts for today
// this will get up to 5 of the most liked posts in the last 24 hours
router.get('/trending', async (req, res) => {
  const query = `
  SELECT key, author, content, total_likes FROM posts JOIN 
    (SELECT post, COUNT(post) as total_likes FROM likes 
      WHERE created_at > current_date - interval '24' hour 
      GROUP BY post ORDER BY total_likes DESC LIMIT 5) AS likes 
    ON post=key ORDER BY total_likes DESC;`

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// get posts from users that you follow
router.get('/following', async (req, res) => {
  res.redirect('/api/posts?following=true')
})

// get a post by its key
router.get('/:key', getPost, async (req, res) => {
  res.send(res.locals.post)
})

// modify the content of a post that you own
router.patch('/:key', getPost, checkPrivilege, async (req, res) => {
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.status(400).send({ err: 'Content must be longer than 3 chars.' })
    return
  }

  const { post } = res.locals
  if (post.content === content) {
    res.status(400).send({ err: 'Content is the same.' })
    return
  }

  const query = {
    text: 'UPDATE posts SET content = $1 WHERE key = $2',
    values: [content, post.key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.status(200).send({ msg: 'Post has been modified.' })
    else res.status(500).send({ err: 'Post could not be modified.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// delete a post that you own
router.delete('/:key', getPost, checkPrivilege, async (req, res) => {
  const query = {
    text: 'DELETE FROM posts WHERE key = $1',
    values: [res.locals.post.key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.status(200).send({ msg: 'Post has been deleted.' })
    else res.status(500).send({ err: 'Post could not be deleted.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

export default router
