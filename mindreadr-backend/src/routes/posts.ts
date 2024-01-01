import { Router } from 'express'
// import pg from 'pg'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'

interface Post {
  key: string
  author: string
  content: string
  parent: string
  created_at: string
}

const router = Router()
router.use(verifyToken)

// helper function to get a post object by its key
async function getPost (key: string): Promise<Post | null> {
  const query = {
    text: 'SELECT * FROM posts WHERE key = $1',
    values: [key]
  }

  const result = await db.query(query)
  if (result.rowCount === 0) return null
  else return result.rows[0]
}

// get all posts, supports by author and offset/limit
router.get('/', async (req, res) => {
  const { offset, limit, author = '' } = req.query

  let parsedOffset = parseInt(offset as string)
  if (offset === undefined) { parsedOffset = 0 } else if (isNaN(parsedOffset)) { return res.sendStatus(400) }

  let parsedLimit = parseInt(limit as string)
  if (limit === undefined) { parsedLimit = 10 } else if (isNaN(parsedLimit)) { return res.sendStatus(400) }
  if (parsedLimit > 100) { parsedLimit = 100 }

  const query = {
    text: `SELECT *, (SELECT COUNT(*) AS likes FROM likes WHERE post=key), 
      EXISTS(SELECT * FROM likes WHERE username=$3 AND post=key) AS liked 
      FROM posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
    values: [limit, offset, res.locals.user.username]
  }

  if (author !== '') {
    query.text = query.text.replace('posts', 'posts WHERE author=$4')
    query.values.push(author)
  }

  const result = await db.query(query)
  res.send(result.rows)
})

// create a new post
router.post('/', async (req, res) => {
  const { content = '' } = req.body
  if (content === '' || content.length < 3) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: 'INSERT INTO posts(author, content) VALUES($1, $2) RETURNING *',
    values: [res.locals.user.username, content]
  }

  const result = await db.query(query)
  res.status(201).send(result.rows[0])
})

// get a post by key
router.get('/:key', async (req, res) => {
  const { key } = req.params
  if (isNaN(parseInt(key))) { return res.sendStatus(400) }

  const post = await getPost(key)
  if (post !== null) { res.send(post) } else { res.sendStatus(404) }
})

export default router
