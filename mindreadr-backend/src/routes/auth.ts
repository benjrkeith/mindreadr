import Router from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import verifyUsername from '../middleware/verifyUsername.js'
import db from '../db.js'
import authSecret from '../config/auth.js'

const router = Router()

// login as an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body // test this with blank and no values
  if (username === '' || password === '') {
    res.sendStatus(400)
    return
  }

  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username]
  }

  const result = await db.query(query)
  if (result.rowCount === 0) {
    res.sendStatus(404)
    return
  }

  const user = result.rows[0]
  const valid = bcrypt.compareSync(password as string, user.password as string)
  if (!valid) {
    res.sendStatus(401)
    return
  }

  delete user.password
  const token = jwt.sign({ username: user.username }, authSecret, { expiresIn: 86400 })
  res.send({ token, ...user })

  query.text = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = $1'
  await db.query(query)
})

// register as a new user
router.post('/register', verifyUsername, async (req, res) => {
  const { username, password } = req.body
  if (username === '' || password === '') {
    res.sendStatus(400)
    return
  }

  const hash = bcrypt.hashSync(password as string, 8)
  const query = {
    text: 'INSERT INTO users VALUES($1, $2)',
    values: [username, hash]
  }

  await db.query(query)
  res.sendStatus(200)
})

export default router
