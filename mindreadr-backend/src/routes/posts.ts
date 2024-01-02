import { Router } from 'express'
// import pg from 'pg'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'
import getPost from '../middleware/getPost.js'

const router = Router()
router.use(verifyToken)

// get all posts, supports by author and offset/limit
router.get('/', async (req, res) => {
  const { offset, limit, author = '' } = req.query

  let parsedOffset = parseInt(offset as string)
  if (offset === undefined) { parsedOffset = 0 } else if (isNaN(parsedOffset)) { return res.sendStatus(400) }

  let parsedLimit = parseInt(limit as string)
  if (limit === undefined) { parsedLimit = 10 } else if (isNaN(parsedLimit)) { return res.sendStatus(400) }
  if (parsedLimit > 100) { parsedLimit = 100 }

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
router.patch('/:key', getPost, async (req, res) => {
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

export default router
