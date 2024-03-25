import {
  type Request, type Response, type NextFunction as NF,
  Router
} from 'express'
import pg from 'pg'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'

const router = Router()

router.use(verifyToken)

// get all users that are in your inbox
router.get('/', async (req: Request, res: Response, next: NF) => {
  const { user } = res.locals
  const query = {
    text: `SELECT DISTINCT author as user, created_at,
          (SELECT avatar from users where username = author) 
          FROM messages WHERE recipient = $1 UNION 
          SELECT DISTINCT recipient as user, created_at,
          (SELECT avatar from users where username = recipient)
          FROM messages WHERE author = $1`,
    values: [user.username]
  }

  const result = await db.query(query)
  res.send(result.rows.map(row => ({
    user: row.user,
    lastMessage: row.created_at,
    avatar: row.avatar
  })))
})

// get all messages between you and another user
router.get('/:target', async (req: Request, res: Response, next: NF) => {
  const { user } = res.locals
  const { target } = req.params

  const query = {
    text: `SELECT key, author, recipient, content, created_at
            FROM messages WHERE (author = $1 AND recipient = $2)
            OR (author = $2 AND recipient = $1)
            ORDER BY created_at DESC`,
    values: [user.username, target]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// create a new message to a specific user
router.post('/:target', async (req: Request, res: Response, next: NF) => {
  const { user } = res.locals
  const { target } = req.params
  const { content } = req.body

  const query = {
    text: `INSERT INTO messages (author, recipient, content)
            VALUES ($1, $2, $3)`,
    values: [user.username, target, content]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// modify the content of a message that you own
router.patch('/:target/:key', async (req, res) => {
  const { user } = res.locals
  const { key } = req.params
  const { content } = req.body
  const query = {
    text: 'UPDATE posts SET content = $1 WHERE key = $2 AND author = $3',
    values: [content, key, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) {
      res.status(200).send({ msg: 'Post has been modified.' })
    } else res.status(500).send({ err: 'Post could not be modified.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// delete a message that you own
router.delete('/:target/:key', async (req: Request, res: Response, next: NF) => {
  const { user } = res.locals
  const { key } = req.params

  const query = {
    text: 'DELETE FROM messages WHERE key = $1 AND author = $2',
    values: [key, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.send({ msg: 'Message deleted.' })
    else res.status(404).send({ err: 'Message not found.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

export default router
