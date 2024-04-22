import { Router } from 'express'
import pg from 'pg'

import checkContent from '../middleware/checkContent.js'

import db from '../db.js'

export interface ParentParams {
  key: string
}

const router = Router({ mergeParams: true })

// get a list of all replies to a post
router.get('/', async (req, res) => {
  const { key } = req.params as ParentParams

  const query = {
    text: `
      SELECT key,
             author,
             ENCODE(avatar, 'base64') AS author_avatar,
             content,
             replies.created_at
        FROM replies
        JOIN users
          ON replies.author = users.username
       WHERE parent = $1
    ORDER BY created_at DESC
    ;`,
    values: [key]
  }

  try {
    const result = await db.query(query)
    const replies = result.rows.map(reply => ({
      key: reply.key,
      author: {
        username: reply.author,
        avatar: reply.author_avatar
      },
      content: reply.content,
      createdAt: reply.created_at
    }))

    res.send(replies)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// reply to an existing post
router.post('/', checkContent(3), async (req, res) => {
  const { user } = res.locals
  const { key } = req.params
  const { content = '' } = req.body

  const query = {
    text: `
      INSERT INTO replies(author, content, parent) 
           VALUES ($1, $2, $3) 
        RETURNING *
    ;`,
    values: [user.username, content, key]
  }

  try {
    const result = await db.query(query)
    res.status(201).send(result.rows[0])
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === '23503') res.sendStatus(404)
      else res.sendStatus(500)
    } else throw err
  }
})

export default router
