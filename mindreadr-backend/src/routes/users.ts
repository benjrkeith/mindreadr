import { Router } from 'express'
import { unlink } from 'fs'
import multer from 'multer'
import pg from 'pg'
import sharp from 'sharp'

import checkSelf from '../middleware/checkSelf.js'
import checkToken from '../middleware/checkToken.js'
import getFollowing from '../middleware/getFollowing.js'
import getTargetUser from '../middleware/getTargetUser.js'

import db from '../db.js'

const router = Router()
router.use(checkToken)

const upload = multer({ dest: 'avatars/' })

// get all usernames + avatars
router.get('/', async (req, res) => {
  const query = {
    text: `
      SELECT username, 
             ENCODE(avatar, 'base64') AS avatar 
        FROM users 
       WHERE username != $1
    ;`,
    values: [res.locals.user.username]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get a target user object
router.get('/:target', getTargetUser, async (req, res) => {
  const { target } = res.locals
  res.send(target)
})

// change your avatar
router.post('/:target/avatar', checkSelf, upload.single('avatar'), async (req, res) => {
  const { file } = req

  if (file === undefined) {
    res.sendStatus(400)
    return
  }

  const img = sharp(file.path).resize(128, 128).jpeg({ quality: 50 })
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
    unlink(file.path, () => {})
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get a list of posts a target user has liked
router.get('/:target/likes', async (req, res) => {
  const { target } = req.params
  const query = {
    text: `
      SELECT posts.key, 
             author, 
             content, 
             parent, 
             posts.created_at
        FROM likes 
        JOIN posts 
          ON likes.post = posts.key 
       WHERE likes.username = $1
    ;`,
    values: [target]
  }

  try {
    const result = await db.query(query)
    const likes = result.rows.map((like) => ({
      key: like.key,
      author: like.author,
      content: like.content,
      parent: like.parent,
      createdAt: like.created_at
    }))

    res.send(likes)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get a list of users who follow a target user
router.get('/:target/followers', async (req, res) => {
  const { target } = req.params
  const query = {
    text: `
      SELECT follower AS username,
             ENCODE(avatar, 'base64') AS avatar
        FROM followers 
        JOIN users
          ON followers.follower = users.username
       WHERE followers.username = $1
    ;`,
    values: [target]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// follow a target user
router.post('/:target/followers', async (req, res) => {
  const { user } = res.locals
  const { target } = req.params

  const query = {
    text: `
      INSERT INTO followers(username, follower) 
           VALUES ($1, $2)
    ;`,
    values: [target, user.username]
  }

  try {
    await db.query(query)
    res.sendStatus(200)
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      if (err.code === '23505') res.sendStatus(409) // already following
      else if (err.code === '23503') res.sendStatus(404) // user doesn't exist
      else res.sendStatus(500)
    } else throw err
  }
})

// unfollow a target user
router.delete('/:target/followers', async (req, res) => {
  const { user } = res.locals
  const { target } = req.params

  const query = {
    text: `
      DELETE FROM followers 
            WHERE username = $1 
              AND follower = $2
    ;`,
    values: [target, user.username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.sendStatus(200)
    else res.sendStatus(404) // not following
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get a list of people a target user follows
router.get('/:target/following', getFollowing, async (req, res) => {
  res.send(res.locals.following)
})

export default router
