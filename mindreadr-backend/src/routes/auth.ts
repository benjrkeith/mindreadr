import { hashSync, compareSync } from 'bcrypt'
import Router from 'express'
import jwt from 'jsonwebtoken'
import pg from 'pg'

import checkCreds from '../middleware/checkCreds.js'

import db from '../db.js'
import secret from '../config/auth.js'
import { type RawUser } from '../types.js'

const router = Router()
router.use(checkCreds)

// register a new user account
router.post('/register', async (req, res) => {
  const username = JSON.stringify(req.body.username)
  const password = JSON.stringify(req.body.password)

  const hash = hashSync(password, 8)
  const query = {
    text: `
      INSERT INTO users(username, password) 
           VALUES ($1, $2)
    ;`,
    values: [username.toLowerCase(), hash]
  }

  try {
    await db.query(query)
    res.sendStatus(201)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === '23505') res.sendStatus(409) // user already exists
      else res.sendStatus(500)
    } else throw err
  }
})

// login as an existing user
router.post('/login', async (req, res) => {
  const username = JSON.stringify(req.body.username)
  const password = JSON.stringify(req.body.password)

  const query = {
    text: `
      SELECT username,
             password,
             created_at,
             last_login,
             privilege,
             ENCODE(avatar, 'base64') AS avatar
        FROM users 
       WHERE username = $1
    ;`,
    values: [username.toLowerCase()]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 0) {
      res.sendStatus(404) // user doesn't exist
      return
    }

    const user: RawUser = result.rows[0]
    const valid = compareSync(password, user.password)
    if (!valid) {
      res.sendStatus(401) // password is incorrect
      return
    }

    const token = jwt.sign({ username: user.username }, secret, { expiresIn: 86400 })
    res.send({
      username: user.username,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      privilege: user.privilege,
      token,
      avatar: user.avatar
    })

    query.text = `
      UPDATE users 
         SET last_login = CURRENT_TIMESTAMP 
       WHERE username = $1
    ;`
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

export default router
