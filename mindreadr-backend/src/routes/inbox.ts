import {
  type Request, type Response, type NextFunction as NF,
  Router
} from 'express'
import pg from 'pg'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'
import getNextConvoKey from '../middleware/getNextConvoKey.js'

const router = Router()

router.use(verifyToken)

// get all conversations that are in your inbox
router.get('/', async (req: Request, res: Response, next: NF) => {
  const { user } = res.locals
  const query = {
    text: `
      SELECT messages.key, messages.conversation, author, content, created_at,
      (SELECT avatar FROM users WHERE username = author),
      (SELECT array_agg(username) FROM conversations WHERE key = messages.conversation) as users
      FROM (SELECT conversation, MAX(key) AS key FROM messages WHERE conversation IN 
        (SELECT key FROM conversations WHERE username = $1) GROUP BY conversation) 
      AS lastMessages JOIN messages on lastMessages.key = messages.key`,
    values: [user.username]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// get all messages in a conversation
router.get('/:key', async (req: Request, res: Response) => {
  const { key } = req.params
  const query = {
    text: `SELECT *, (SELECT avatar from users where username = author)
            FROM messages WHERE conversation = $1 ORDER BY created_at DESC`,
    values: [key]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// create a new private message conversation
router.post('/', getNextConvoKey, async (req: Request, res: Response) => {
  const { user, nextKey } = res.locals
  if (req.query.users === undefined) {
    res.sendStatus(400)
    return
  }

  const rawTargets = req.query.users as string
  const targets = rawTargets.split('&')
  targets.push(user.username as string)

  const query = 'INSERT INTO conversations (key, username) VALUES ($1, $2)'
  let values = []

  for (const target of targets) {
    values = [nextKey, target]

    try {
      const result = await db.query(query, values)
      res.send(result.rows[0])
    } catch (err) {
      if (err instanceof pg.DatabaseError) {
        console.error(err)
        res.sendStatus(500)
      } else throw err
    }
  }

  res.send({ conversation_key: nextKey })
})

// create a new message in an existing conversatian
router.post('/:key', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { key } = req.params
  const { content } = req.body

  const query = {
    text: `INSERT INTO messages (conversation, author, content)
            VALUES ($1, $2, $3) RETURNING *`,
    values: [key, user.username, content]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows[0])
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// modify the content of a message that you own
router.patch('/:conversation/messages/:key', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { key } = req.params
  const { content } = req.body

  const query = {
    text: 'UPDATE messages SET content = $1 WHERE key = $2 AND author = $3',
    values: [content, key, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) {
      res.status(200).send({ msg: 'Post has been modified.' })
    } else res.status(400).send({ err: 'You cannot modify this post.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// delete a message that you own
router.delete('/:conversation/messages/:key', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { key } = req.params

  const query = {
    text: 'DELETE FROM messages WHERE key = $1 AND author = $2',
    values: [key, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.send({ msg: 'Message deleted.' })
    else res.status(400).send({ err: 'You cannot delete this post.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

export default router
