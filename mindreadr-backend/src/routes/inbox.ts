import { Router, type Request, type Response } from 'express'
import pg from 'pg'
import { type Server } from 'socket.io'

import checkChatPerms from '../middleware/checkChatPerms.js'
import checkContent from '../middleware/checkContent.js'
import checkToken from '../middleware/checkToken.js'

import db from '../db.js'

const router = Router()
router.use(checkToken)

// get all chats and their most recent message from your inbox
router.get('/', async (req: Request, res: Response) => {
  const { user } = res.locals

  const query = {
    text: `
      WITH users_chats 
        AS (SELECT key,
                   read
              FROM chat_members
             WHERE username = $1),
      
           last_msg_per_chat 
        AS (SELECT chat,
                   MAX(key) AS key
              FROM messages
             WHERE chat 
                IN (SELECT key 
                      FROM users_chats)
          GROUP BY chat)
    
    SELECT m.chat AS key,
           c.name,
           uc.read,
           m.key AS last_msg,
           m.author AS lm_author,
           m.content AS lm_content,
           m.created_at AS lm_created_at,
           m.system AS lm_system,
           ENCODE(u.avatar, 'base64') AS lm_author_avatar
      FROM last_msg_per_chat lm
      JOIN messages m
        ON lm.key = m.key
      JOIN users_chats uc
        ON uc.key = m.chat
      JOIN users u
        ON u.username = m.author
      JOIN chats c
        ON c.key = m.chat
  ORDER BY m.created_at DESC
    ;`,
    values: [user.username]
  }

  try {
    const result = await db.query(query)
    const chats = result.rows.map((chat) => {
      if (chat.lm_system as boolean) {
        switch (chat.lm_content) {
          case '0000':
            chat.lm_content = `${chat.lm_author} created the chat.`
            break
        }
      }
      return {
        key: chat.key,
        name: chat.name,
        read: chat.read,
        lastMsg: {
          key: chat.last_msg,
          author: {
            username: chat.lm_author,
            avatar: chat.lm_author_avatar
          },
          content: chat.lm_content,
          createdAt: chat.lm_created_at,
          system: chat.lm_system
        }
      }
    })

    res.send(chats)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get all messages in a single chat
router.get('/:chat', checkChatPerms, async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat } = req.params

  let query = {
    text: `
      SELECT key, 
             chat,
             author,
             ENCODE(avatar, 'base64') AS author_avatar,
             content,
             system,
             messages.created_at,
             (SELECT ARRAY_AGG(username)
                FROM chat_members
               WHERE key = chat) 
                  AS users
        FROM messages
        JOIN users 
          ON author = username 
       WHERE chat = $1 
    ORDER BY created_at ASC
    ;`,
    values: [chat]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) {
      res.sendStatus(404)
      return
    }

    const msgs = result.rows.map((msg) => {
      if (msg.system as boolean) {
        switch (msg.content) {
          case '0000':
            msg.content = `${msg.author} created the chat.`
            break
        }
      }
      return {
        key: msg.key,
        author: {
          username: msg.author,
          avatar: msg.author_avatar
        },
        content: msg.content,
        createdAt: msg.created_at,
        system: msg.system
      }
    })

    res.send({ msgs, users: result.rows[0].users })

    query = {
      text: `
        UPDATE chat_members 
           SET read = TRUE 
         WHERE key = $1 
           AND username = $2
      ;`,
      values: [chat, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// create a new private message chat
router.post('/', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { name, targets: _targets } = req.body

  if (_targets === undefined || !Array.isArray(_targets)) {
    res.sendStatus(400)
    return
  }

  const targets = new Set([..._targets, user.username])
  if (name === undefined || name?.length === 0 || targets.size < 2) {
    res.sendStatus(400)
    return
  }

  const createChatQuery = {
    text: `
      INSERT INTO chats (name) 
           VALUES ($1)
        RETURNING key
    ;`,
    values: [name]
  }

  const sendFirstMsgQuery = `
    INSERT INTO messages (chat, author, content, system)
         VALUES ($1, $2, $3, TRUE)
  ;`

  const addMemberQuery = `
    INSERT INTO chat_members (key, username) 
         VALUES ($1, $2)
  ;`

  try {
    const result = await db.query(createChatQuery)
    const key = result.rows[0].key

    // if msg is system, content is the code for the type of system message
    const values = [key, user.username, '0000']
    await db.query(sendFirstMsgQuery, values)

    for (const target of targets) {
      const values = [key, target]
      await db.query(addMemberQuery, values)
    }

    if (!res.headersSent) res.status(201).send({ chat: key })

    const ws: Server = req.app.get('ws')
    ws.to(_targets).emit('newChat', {
      key,
      name
    })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// create a new message in an existing chat you are apart of
router.post('/:chat', checkChatPerms, checkContent(1), async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat } = req.params
  const { content } = req.body

  let query = {
    text: `
      INSERT INTO messages (chat, author, content)
           VALUES ($1, $2, $3) 
        RETURNING *,
                  (SELECT ENCODE(avatar, 'base64') AS avatar
                     FROM users
                    WHERE username = author) 
                       AS author_avatar,
                  (SELECT ARRAY_AGG(username)
                     FROM chat_members
                    WHERE key = chat) 
                       AS users
    ;`,
    values: [chat, user.username, content]
  }

  try {
    const result = (await db.query(query)).rows[0]
    const msg = {
      key: result.key,
      chat: result.chat,
      author: {
        username: result.author,
        avatar: result.author_avatar
      },
      content: result.content,
      createdAt: result.created_at
    }
    res.status(201).send(msg)

    const ws: Server = req.app.get('ws')
    ws.to(result.users as string[]).emit('msg', msg)

    query = {
      text: `
        UPDATE chat_members 
           SET read = FALSE 
         WHERE key = $1 
           AND username != $2
      ;`,
      values: [chat, user.username]
    }
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

// modify the content of a message that you own
router.patch('/:chat/msgs/:msg', checkContent(1), async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat, msg } = req.params
  const { content } = req.body

  const query = {
    text: `
      UPDATE messages 
         SET content = $1 
       WHERE key = $2 
         AND chat = $3 
         AND author = $4
         AND system = FALSE
    ;`,
    values: [content, msg, chat, user.username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 1) res.sendStatus(200)
    else res.sendStatus(400)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// delete a message that you own
router.delete('/:chat/msgs/:msg', async (req: Request, res: Response) => {
  const { user } = res.locals
  const { chat, msg } = req.params

  const query = {
    text: `
      DELETE FROM messages 
            WHERE key = $1 
              AND chat = $2 
              AND author = $3
              AND system = FALSE
    ;`,
    values: [msg, chat, user.username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 1) res.sendStatus(200)
    else res.sendStatus(400)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.log(err)
      res.sendStatus(500)
    } else throw err
  }
})

export default router
