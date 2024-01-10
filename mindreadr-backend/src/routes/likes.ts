import { Router } from 'express'
import pg from 'pg'

import db from '../db.js'
import getPost from '../middleware/getPost.js'

const router = Router({ mergeParams: true })

// get a list of all users who liked a post
router.get('/', getPost, async (req, res) => {
  const { post } = res.locals
  const query = {
    text: 'SELECT username FROM likes WHERE post = $1',
    values: [post.key]
  }

  try {
    const result = await db.query(query)
    res.send(result.rows.map((x) => x.username))
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// like a post
router.post('/', getPost, async (req, res) => {
  const { post } = res.locals
  if (post.liked as boolean) {
    res.status(409).send({ err: 'You have already liked this post.' })
    return
  }

  const query = {
    text: 'INSERT INTO likes VALUES($1, $2)',
    values: [res.locals.user.username, post.key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.status(201).send({ msg: 'Post has been liked.' })
    else res.status(500).send({ err: 'Post could not be liked.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

// unlike a given post
router.delete('/', getPost, async (req, res) => {
  const { post } = res.locals
  if (!(post.liked as boolean)) {
    res.status(404).send({ err: 'You have not liked this post.' })
    return
  }

  const query = {
    text: 'DELETE FROM likes WHERE username = $1 AND post = $2',
    values: [res.locals.user.username, post.key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 1) res.status(200).send({ msg: 'Like successfully removed.' })
    else res.status(500).send({ err: 'Like could not be removed.' })
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
})

export default router
