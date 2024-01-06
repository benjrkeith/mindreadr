import { Router } from 'express'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'
import parseLimits from '../middleware/parseLimits.js'
import getTargetUser from '../middleware/getTargetUser.js'

const router = Router()

router.use(verifyToken)

// get all users, supports offset and limit
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

// get a specific user object
router.get('/:username', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  res.send(targetUser)
})

// get a list of posts a user has liked
router.get('/:username/likes', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  const query = {
    text: `SELECT key, author, content, parent, posts.created_at
      FROM likes JOIN posts on post = key WHERE author = $1`,
    values: [targetUser.username]
  }

  const result = await db.query(query)
  res.send(result.rows)
})

// get a list of who follows a specific user
router.get('/:username/followers', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  const query = {
    text: 'SELECT follower FROM followers WHERE username = $1',
    values: [targetUser.username]
  }

  const result = await db.query(query)
  res.send(result.rows.map(x => x.follower))
})

// follow a specific user
router.post('/:username/followers', getTargetUser, async (req, res) => {
  const { user, targetUser } = res.locals
  const query = {
    text: 'INSERT INTO followers(username, follower) VALUES($1, $2)',
    values: [targetUser.username, user.username]
  }

  await db.query(query)
  res.sendStatus(200)
})

// get a list of who a specific user follows
router.get('/:username/following', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  const query = {
    text: 'SELECT username FROM followers WHERE follower = $1',
    values: [targetUser.username]
  }

  const result = await db.query(query)
  res.send(result.rows.map(x => x.username))
})

export default router

// array(SELECT username FROM followers WHERE follower = $1) as following,
// array(SELECT follower FROM followers WHERE username = $1) as followers,
// array(SELECT post FROM likes WHERE username = $1) as likes
