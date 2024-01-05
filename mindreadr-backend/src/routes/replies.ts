import { Router } from 'express'

import db from '../db.js'
import getPost from '../middleware/getPost.js'

const router = Router({ mergeParams: true })

// get a list of all direct replies to a post
router.get('/', getPost, async (req, res) => {
  const { post } = res.locals
  const query = {
    text: 'SELECT * FROM posts WHERE parent = $1',
    values: [post.key]
  }

  const result = await db.query(query)
  res.send(result.rows)
})

// reply to an existing post
router.post('/', getPost, async (req, res) => {
  const { post } = res.locals
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: 'INSERT INTO posts(author, content, parent) VALUES($1, $2, $3) RETURNING *',
    values: [res.locals.user.username, content, post.key]
  }

  const result = await db.query(query)
  res.status(201).send(result.rows[0])
})

export default router
