import bcrypt from 'bcrypt'
import Router from 'express'
import jwt from 'jsonwebtoken'
import pg from 'pg'

import db from '../db.js'
import verifyUsername from '../middleware/verifyUsername.js'
import secret from '../config/auth.js'

const router = Router()

// register a new user account
router.post('/register', verifyUsername, async (req, res) => {
  const { username = '', password = '' } = req.body
  if (username === '' || password === '') {
    res.status(400).send({ err: 'You must supply a username and password.' })
    return
  }

  const hash = bcrypt.hashSync(JSON.stringify(password), 8)
  const query = {
    text: 'INSERT INTO users(username, password) VALUES($1, $2)',
    values: [username, hash]
  }

  try {
    await db.query(query)
    res.status(201).send({ msg: 'User has been registered.' })
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
    res.status(400).send({ err: 'You must supply a username and password.' })
    return
  }

  const query = {
    text: 'SELECT * FROM users WHERE username = $1',
    values: [username]
  }

  try {
    const result = await db.query(query)

    if (result.rowCount === 0) {
      res.status(404).send({ err: 'User could not be found.' })
      return
    }

    const user = result.rows[0]
    const valid = bcrypt.compareSync(JSON.stringify(password), user.password as string)
    if (!valid) {
      res.status(401).send({ err: 'Incorrect password.' })
      return
    }

    query.text = 'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE username = $1'
    await db.query(query)

    delete user.password
    const token = jwt.sign({ username: user.username }, secret, { expiresIn: 86400 })
    res.send({ token, ...user })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

export default router
