import { Router } from 'express'
import multer from 'multer'
import pg from 'pg'
import sharp from 'sharp'

import db from '../db.js'

import getTargetUser from '../middleware/getTargetUser.js'
import getFollowing from '../middleware/getFollowing.js'
import parseLimits from '../middleware/parseLimits.js'
import verifyToken from '../middleware/verifyToken.js'
import { unlink } from 'fs'

const router = Router()
router.use(verifyToken)
const upload = multer({ dest: 'avatars/' })

// get all users, supports offset and limit
router.get('/', parseLimits, async (req, res) => {
  // const { offset, limit } = res.locals

  const query = {
    // text: `SELECT username, created_at, last_login, privilege FROM users
    //         ORDER BY created_at LIMIT $1 OFFSET $2`,
    text: `
      SELECT LOWER(username) AS username, 
             ENCODE(avatar, 'base64') AS avatar 
        FROM users 
       WHERE username != $1
    ;`,
    values: [res.locals.user.username]
    // values: [limit, offset]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
})

// get a specific user object
router.get('/:username', getTargetUser, async (req, res) => {
  const { targetUser } = res.locals
  res.send(targetUser)
})

// change your avatar
router.post('/:username/avatars', upload.single('avatar'), async (req, res) => {
  if (req.file === undefined) { return res.sendStatus(400) }
  const img = sharp(req.file.path).resize(128, 128).jpeg({ quality: 50 })

  const query = {
    text: `
      UPDATE users
         SET avatar = $1
       WHERE username = $2
    ;`,
    values: [await img.toBuffer(), req.params.username]
  }

  try {
    await db.query(query)
    res.sendStatus(201)
    unlink(req.file.path, () => {})
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
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
      res.sendStatus(500)
    } else throw err
  }
})

// get a list of who follows a specific user
router.get('/:username/followers', async (req, res) => {
  const { username } = req.params
  const query = {
    text: `
      SELECT followers.follower AS username,
             ENCODE(avatar, 'base64') AS avatar
        FROM followers 
        JOIN users
          ON followers.follower = users.username
       WHERE followers.username = $1
    ;`,
    values: [username]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
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
  res.send(res.locals.following)
})

export default router
