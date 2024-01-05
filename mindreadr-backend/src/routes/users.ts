import { Router } from 'express'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'
import parseLimits from '../middleware/parseLimits.js'
import getUser from '../middleware/getUser.js'

const router = Router()

router.use(verifyToken)

router.get('/', parseLimits, async (req, res) => {
  const { offset, limit } = res.locals

  const query = {
    text: `SELECT username, created_at, last_login, privilege FROM users 
            ORDER BY created_at LIMIT $1 OFFSET $2`,
    values: [limit, offset]
  }

  const result = await db.query(query)
  res.send(result.rows)
})

router.get('/:username', getUser, async (req, res) => {
  const user = res.locals.targetUser
  res.send(user)
})

router.get('/:username/likes', getUser, async (req, res) => {
  const user = res.locals.targetUser
  const query = {
    text: `SELECT key, author, content, parent, posts.created_at
      FROM likes JOIN posts on post = key WHERE author = $1`,
    values: [user.username]
  }

  const result = await db.query(query)
  res.send(result.rows.map(x => x))
})

export default router

// array(SELECT username FROM followers WHERE follower = $1) as following,
// array(SELECT follower FROM followers WHERE username = $1) as followers,
// array(SELECT post FROM likes WHERE username = $1) as likes
