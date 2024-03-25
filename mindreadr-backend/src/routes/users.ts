import { Router } from 'express'
import pg from 'pg'

import db from '../db.js'
import messagesRouter from './messages.js'
import verifyToken from '../middleware/verifyToken.js'
import parseLimits from '../middleware/parseLimits.js'
import getTargetUser from '../middleware/getTargetUser.js'
import getFollowing from '../middleware/getFollowing.js'

const router = Router()

router.use(verifyToken)
router.use('/:username/messages', messagesRouter)

// get all users, supports offset and limit
router.get('/', parseLimits, async (req, res) => {
  // const { offset, limit } = res.locals

  const query = {
    // text: `SELECT username, created_at, last_login, privilege FROM users
    //         ORDER BY created_at LIMIT $1 OFFSET $2`,
    text: 'SELECT username FROM users'
    // values: [limit, offset]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows.map((row) => row.username))
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// get a specific user object
router.get('/:username', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  res.send(targetUser)
})

// get a specific users posts - alias to /posts?author={user}
// not a fan of this implementation for passing through query, unsure how else to do it
router.get('/:username/posts', async (req, res) => {
  const { username } = req.params
  const { limit, offset } = req.query

  const argsLim = limit !== undefined ? `&limit=${limit as string}` : ''
  const argsOffset = offset !== undefined ? `&offset=${offset as string}` : ''

  res.redirect(`/api/posts?author=${username}${argsLim}${argsOffset}`)
})

// get a list of posts a user has liked
router.get('/:username/likes', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  const query = {
    text: `SELECT key, author, content, parent, posts.created_at
      FROM likes JOIN posts on post = key WHERE author = $1`,
    values: [targetUser.username]
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

// get a list of who follows a specific user
router.get('/:username/followers', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  const query = {
    text: 'SELECT follower FROM followers WHERE username = $1',
    values: [targetUser.username]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows.map(x => x.follower))
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// follow a specific user
router.post('/:username/followers', getTargetUser, async (req, res) => {
  const { user, targetUser } = res.locals
  const query = {
    text: 'INSERT INTO followers(username, follower) VALUES($1, $2)',
    values: [targetUser.username, user.username]
  }

  try {
    await db.query(query)
    res.sendStatus(200)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// unfollow a specific user
router.delete('/:username/followers', getTargetUser, async (req, res) => {
  const { user, targetUser } = res.locals
  const query = {
    text: 'DELETE FROM followers WHERE username = $1 AND follower = $2',
    values: [targetUser.username, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.sendStatus(200)
    else res.sendStatus(500)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// get a list of who a specific user follows
router.get('/:username/following', getTargetUser, getFollowing, async (req, res) => {
  res.send(res.locals.followers)
})

export default router
