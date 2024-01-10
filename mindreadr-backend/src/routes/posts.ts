import { Router } from 'express'
import pg from 'pg'

import db from '../db.js'
import likesRouter from './likes.js'
import repliesRouter from './replies.js'
import verifyToken from '../middleware/verifyToken.js'
import getPost from '../middleware/getPost.js'
import checkPrivilege from '../middleware/checkPrivilege.js'
import parseLimits from '../middleware/parseLimits.js'
import getFollowers from '../middleware/getFollowers.js'

const router = Router()

router.use(verifyToken)
router.use('/:key/likes', likesRouter)
router.use('/:key/replies', repliesRouter)

// get all posts, supports by author and offset/limit
router.get('/', parseLimits, getFollowers, async (req, res) => {
  const { author, following = false } = req.query
  const { offset, limit, user, followers } = res.locals

  // the where clause allows postgres to evaluate whether to filter by a
  // specific author, by the list of people you follow, or just all posts
  // if author is specified, and following=true, it will only return posts
  // if you follow the specific author
  const query = {
    text: `SELECT *, 
      (SELECT COUNT(*) AS likes FROM likes WHERE post=key), 
      EXISTS(SELECT * FROM likes WHERE username=$3 AND post=key) AS liked 
      FROM posts WHERE ($4::text IS NULL AND ($6 IS FALSE OR author=ANY($5)) 
      OR (author=$4 AND $4=ANY($5)) OR (author=$4 AND $6 IS FALSE))
      ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    values: [limit, offset, user.username, author, followers, following]
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
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.status(400).send({ err: 'Content must be longer than 3 chars.' })
    return
  }

  const query = {
    text: 'INSERT INTO posts(author, content) VALUES($1, $2) RETURNING *',
    values: [res.locals.user.username, content]
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
