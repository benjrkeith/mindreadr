import { Router } from 'express'
import pg from 'pg'

import db from '../db.js'
import { type ParentParams } from './replies.js'

const router = Router({ mergeParams: true })

// get a list of all users who liked a post
router.get('/', async (req, res) => {
  const { key } = req.params as ParentParams

  const query = {
    text: `
      SELECT likes.username,
             ENCODE(avatar, 'base64') AS avatar 
        FROM likes
        JOIN users
          ON likes.username = users.username 
       WHERE post = $1
    ;`,
    values: [key]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// like a post
router.post('/', async (req, res) => {
  const { user } = res.locals
  const { key } = req.params as ParentParams

  const query = {
    text: `
      INSERT INTO likes 
           VALUES ($1, $2)
    ;`,
    values: [user.username, key]
  }

  try {
    await db.query(query)
    res.sendStatus(201)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === '23505') res.sendStatus(409)
      else if (err.code === '23503') res.sendStatus(404)
      else res.sendStatus(500)
    } else throw err
  }
})

// unlike a post
router.delete('/', async (req, res) => {
  const { user } = res.locals
  const { key } = req.params as ParentParams

  const query = {
    text: `
      DELETE FROM likes 
            WHERE username = $1 
              AND post = $2
    ;`,
    values: [user.username, key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.sendStatus(200)
    else res.sendStatus(404)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

export default router
