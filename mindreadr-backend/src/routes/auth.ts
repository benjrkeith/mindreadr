import { hashSync, compareSync } from 'bcrypt'
import Router from 'express'
import jwt from 'jsonwebtoken'
import pg from 'pg'

import verifyUsername from '../middleware/verifyUsername.js'

import db from '../db.js'
import secret from '../config/auth.js'

const router = Router()

// register a new user account
router.post('/register', verifyUsername, async (req, res) => {
  const { username = '', password = '' } = req.body
  if (username === '' || password === '') {
    res.sendStatus(400)
    return
  }

  const hash = hashSync(JSON.stringify(password), 8)
  const query = {
    text: `
      INSERT INTO users(username, password) 
           VALUES ($1, $2)
    ;`,
    values: [username, hash]
  }

  try {
    await db.query(query)
    res.sendStatus(201)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// login as an existing user
router.post('/login', async (req, res) => {
  const { username = '', password = '' } = req.body
  if (username === '' || password === '') {
    res.sendStatus(400)
    return
  }

  const query = {
    text: `
      SELECT username,
             password,
             created_at,
             last_login,
             avatar,
             privilege 
        FROM users 
       WHERE username = $1
    ;`,
    values: [username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 0) {
      res.sendStatus(404)
      return
    }

    const user = result.rows[0]
    const valid = compareSync(JSON.stringify(password), user.password as string)
    if (!valid) {
      res.sendStatus(401)
      return
    }

    const token = jwt.sign({ username: user.username }, secret, { expiresIn: 86400 })
    res.send({
      username: user.username,
      avatar: user.avatar,
      createdAt: user.created_at,
      lastLogin: user.last_login,
      privilege: user.privilege,
      token
    })

    query.text = `
      UPDATE users 
         SET last_login = CURRENT_TIMESTAMP 
       WHERE username = $1
    ;`
    await db.query(query)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      if (!res.headersSent) res.sendStatus(500)
    } else throw err
  }
})

export default router
