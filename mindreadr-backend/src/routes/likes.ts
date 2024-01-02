import { Router } from 'express'

import db from '../db.js'
import getPost from '../middleware/getPost.js'

const router = Router({ mergeParams: true })

// get a list of all users who liked a post
router.get('/', getPost, async (req, res) => {
  const { post } = res.locals
  const query = {
    text: 'SELECT username FROM likes WHERE post = $1',
    values: [post.key]
  }

  const result = await db.query(query)
  res.send(result.rows.map((x) => x.username))
})

// like a post
router.post('/', getPost, async (req, res) => {
  const { post } = res.locals
  if (post.liked as boolean) {
    res.sendStatus(409)
    return
  }

  const query = {
    text: 'INSERT INTO likes VALUES($1, $2)',
    values: [res.locals.user.username, post.key]
  }

  await db.query(query)
  res.sendStatus(201)
})

// unlike a given post
router.delete('/', getPost, async (req, res) => {
  const { post } = res.locals
  if (!(post.liked as boolean)) {
    res.sendStatus(404)
    return
  }

  const query = {
    text: 'DELETE FROM likes WHERE username = $1 AND post = $2',
    values: [res.locals.user.username, post.key]
  }

  await db.query(query)
  res.sendStatus(200)
})

export default router
