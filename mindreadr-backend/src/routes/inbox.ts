import { Router, type Request, type Response } from 'express'
import pg from 'pg'

import db from '../db.js'
import getNewChatKey from '../middleware/getNewChatKey.js'
import verifyToken from '../middleware/verifyToken.js'

const router = Router()
router.use(verifyToken)

// get all chats and their most recent message from your inbox
router.get('/', async (req: Request, res: Response) => {
  const { user } = res.locals
  const query = {
    text: `
      SELECT messages.chat AS key, 
             messages.key AS last_msg, 
             author, 
             (SELECT avatar 
                FROM users 
               WHERE username = author)
                  AS author_avatar,
             content, 
             created_at,
             (SELECT read
                FROM chats
               WHERE key = messages.chat AND username = $1) 
                  AS read,
             (SELECT array_agg(username) 
                FROM chats 
               WHERE key = messages.chat) 
                  AS users
        FROM (SELECT chat, 
                     MAX(key) AS key 
                FROM messages 
               WHERE chat IN (SELECT key 
                              FROM chats 
                              WHERE username = $1)
            GROUP BY chat) 
                  AS lastMsgs 
        JOIN messages on messages.key = lastMsgs.key
    ORDER BY created_at DESC
      ;`,
    values: [user.username]
  }

  try {
    const result = await db.query(query)
    const chats = result.rows.map((chat) => {
      return {
        key: chat.key,
        read: chat.read,
        users: chat.users,
        lastMsg: {
          key: chat.last_msg,
          author: {
            username: chat.author,
            avatar: chat.author_avatar
          },
          content: chat.content,
          createdAt: chat.created_at
        }
      }
    })

    res.send(chats)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// get all messages in a single chat
router.get('/:chat', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat } = req.params

  let query = {
    text: `
      SELECT key, 
             chat,
             author,
             (SELECT avatar 
                FROM users 
               WHERE username = author) 
                  AS author_avatar,
             content,
             created_at
        FROM messages 
       WHERE chat = $1 
    ORDER BY created_at ASC
    ;`,
    values: [chat]
  }

  try {
    const result = await db.query(query)
    const msgs = result.rows.map((msg) => {
      return {
        key: msg.key,
        author: {
          username: msg.author,
          avatar: msg.author_avatar
        },
        content: msg.content,
        createdAt: msg.created_at
      }
    })
    res.send(msgs)

    query = {
      text: `
        UPDATE chats 
           SET read = TRUE 
         WHERE key = $1 AND username = $2
      ;`,
      values: [chat, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// create a new private message chat
router.post('/', getNewChatKey, async (req: Request, res: Response) => {
  const { user, nextKey } = res.locals

  if (req.query.users === undefined) {
    res.sendStatus(400)
    return
  }

  const rawTargets = req.query.users as string
  const targets = rawTargets.split('&')
  targets.push(user.username as string)

  const query = `
    INSERT INTO chats (key, username) 
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
  if (!res.headersSent) res.status(201).send({ chat: nextKey })
})

// create a new message in an existing chat you are apart of
router.post('/:chat', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat } = req.params
  const { content } = req.body

  let query = {
    text: `
      INSERT INTO messages (chat, author, content)
           VALUES ($1, $2, $3) 
        RETURNING *
    ;`,
    values: [chat, user.username, content]
  }

  try {
    const result = (await db.query(query)).rows[0]
    const msg = {
      key: result.key,
      chat: result.chat,
      author: {
        username: result.author
      },
      content: result.content,
      createdAt: result.created_at
    }
    res.status(201).send(msg)

    query = {
      text: `
        UPDATE chats 
           SET read = FALSE 
         WHERE key = $1 AND username != $2
      ;`,
      values: [chat, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// patch and delete need testing and checking

// modify the content of a message that you own
router.patch('/:chat/messages/:msg', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat, msg } = req.params
  const { content } = req.body

  const query = {
    text: `
      UPDATE messages 
         SET content = $1 
       WHERE key = $2 AND chat = $3 AND author = $4
    ;`,
    values: [content, msg, chat, user.username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 1) res.status(200)
    else res.status(400)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// delete a message that you own
router.delete('/:chat/messages/:msg', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat, msg } = req.params

  const query = {
    text: `
      DELETE FROM messages 
            WHERE key = $1 AND chat = $2 AND author = $3
    ;`,
    values: [msg, chat, user.username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 1) res.sendStatus(200)
    else res.status(400)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

export default router
