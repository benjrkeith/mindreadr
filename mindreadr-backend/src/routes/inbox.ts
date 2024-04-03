import { Router, type Request, type Response } from 'express'
import pg from 'pg'

import db from '../db.js'
import getNextConvoKey from '../middleware/getNextConvoKey.js'
import verifyToken from '../middleware/verifyToken.js'

const router = Router()
router.use(verifyToken)

// get all conversations and their most recent message from your inbox
router.get('/', async (req: Request, res: Response) => {
  const { user } = res.locals
  const query = {
    text: `
      SELECT messages.key, 
             messages.conversation, 
             author, 
             content, 
             created_at,
             (SELECT read
              FROM conversations
              WHERE key = messages.conversation AND username = $1) as read,
             (SELECT avatar 
                FROM users 
               WHERE username = author),
             (SELECT array_agg(username) 
                FROM conversations 
               WHERE key = messages.conversation) as users
        FROM (SELECT conversation, 
                     MAX(key) AS key 
                FROM messages 
               WHERE conversation IN (SELECT key 
                                        FROM conversations 
                                       WHERE username = $1) 
            GROUP BY conversation) AS lastMessages 
        JOIN messages on lastMessages.key = messages.key
      ;`,
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

// get all messages in a single conversation
router.get('/:convo', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { convo } = req.params
  let query = {
    text: `
      SELECT key, 
             conversation,
             author,
             content,
             created_at,
             (SELECT avatar 
                FROM users 
                WHERE username = author)
        FROM messages 
       WHERE conversation = $1 
    ORDER BY created_at DESC
    ;`,
    values: [convo]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)

    query = {
      text: `
        UPDATE conversations 
        SET read = TRUE 
        WHERE key = $1 AND username = $2
      ;`,
      values: [convo, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      if (!res.headersSent) res.sendStatus(500)
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

  const query = `
    INSERT INTO conversations (key, username) 
    VALUES ($1, $2)
  ;`

  for (const target of targets) {
    const values = [nextKey, target]

    try {
      await db.query(query, values)
    } catch (err) {
      if (err instanceof pg.DatabaseError) {
        if (!res.headersSent) res.sendStatus(500)
      } else throw err
    }
  }
  if (!res.headersSent) res.status(201).send({ conversation_key: nextKey })
})

// create a new message in an existing conversation you are apart of
router.post('/:convo', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { convo } = req.params
  const { content } = req.body

  let query = {
    text: `
      INSERT INTO messages (conversation, author, content)
      VALUES ($1, $2, $3) 
      RETURNING *
    ;`,
    values: [convo, user.username, content]
  }

  try {
    const result = await db.query(query)
    res.status(201).send(result.rows[0])

    query = {
      text: `
        UPDATE conversations 
        SET read = FALSE 
        WHERE key = $1 AND username != $2
      ;`,
      values: [convo, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// modify the content of a message that you own
router.patch('/:convo/messages/:msg', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { msg } = req.params
  const { content } = req.body

  const query = {
    text: `
      UPDATE messages 
      SET content = $1 
      WHERE key = $2 AND author = $3
    ;`,
    values: [content, msg, user.username]
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
router.delete('/:convo/messages/:msg', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { key } = req.params

  const query = {
    text: `
      DELETE FROM messages 
      WHERE key = $1 AND author = $2
    ;`,
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
