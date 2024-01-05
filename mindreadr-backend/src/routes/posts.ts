import { Router } from 'express'
// import pg from 'pg'

import db from '../db.js'
import likesRouter from './likes.js'
import repliesRouter from './replies.js'
import verifyToken from '../middleware/verifyToken.js'
import getPost from '../middleware/getPost.js'
import checkPrivilege from '../middleware/checkPrivilege.js'
import parseLimits from '../middleware/parseLimits.js'

const router = Router()

router.use(verifyToken)
router.use('/:key/likes', likesRouter)
router.use('/:key/replies', repliesRouter)

// get all posts, supports by author and offset/limit
router.get('/', parseLimits, async (req, res) => {
  const { author = '' } = req.query
  const { offset, limit } = res.locals

  const query = {
    text: `SELECT *, (SELECT COUNT(*) AS likes FROM likes WHERE post=key), 
      EXISTS(SELECT * FROM likes WHERE username=$3 AND post=key) AS liked 
      FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    values: [limit, offset, res.locals.user.username]
  }

  if (author !== '') {
    query.text = query.text.replace('posts', 'posts WHERE author=$4')
    query.values.push(author)
  }

  const result = await db.query(query)
  res.send(result.rows)
})

// create a new post
router.post('/', async (req, res) => {
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: 'INSERT INTO posts(author, content) VALUES($1, $2) RETURNING *',
    values: [res.locals.user.username, content]
  }

  const result = await db.query(query)
  res.status(201).send(result.rows[0])
})

// get a post by its key
router.get('/:key', getPost, async (req, res) => {
  res.send(res.locals.post)
})

// modify the content of a post that you own
router.patch('/:key', getPost, checkPrivilege, async (req, res) => {
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.sendStatus(400)
    return
  }

  const { post } = res.locals
  if (post.content !== content) {
    const query = {
      text: 'UPDATE posts SET content = $1 WHERE key = $2',
      values: [content, post.key]
    }
    await db.query(query)
    res.sendStatus(200)
  } else {
    res.sendStatus(400)
  }
})

// delete a post that you own
router.delete('/:key', getPost, checkPrivilege, async (req, res) => {
  const query = {
    text: 'DELETE FROM posts WHERE key = $1',
    values: [res.locals.post.key]
  }
  const result = await db.query(query)

  if (result.rowCount === 1) res.sendStatus(200)
  else res.sendStatus(500)
})

export default router
