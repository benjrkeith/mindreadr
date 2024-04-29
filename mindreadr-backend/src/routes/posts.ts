import { Router } from 'express'
import pg from 'pg'

import likesRouter from './likes.js'
import repliesRouter from './replies.js'

import checkContent from '../middleware/checkContent.js'
import checkOffsetLimit from '../middleware/checkOffsetLimit.js'
import checkToken from '../middleware/checkToken.js'
import getPost from '../middleware/getPost.js'

import db from '../db.js'

const router = Router()

router.use(checkToken)
router.use('/:key/likes', likesRouter)
router.use('/:key/replies', repliesRouter)

router.get('/', checkOffsetLimit, async (req, res) => {
  const { author, following = false } = req.query
  const { offset, limit, user } = res.locals

  const query = {
    text: `
      WITH targets
        AS (SELECT key
              FROM posts
             WHERE (NOT $1 
               AND $2::text IS NULL)
                OR author = $2
                OR ($2 IS NULL
               AND author IN (SELECT username
                                FROM followers
                               WHERE follower = $3))
          ORDER BY created_at DESC
             LIMIT $4
            OFFSET $5),

           likes
        AS (SELECT post,
                   COUNT(post)::int AS likes,
                   EXISTS(SELECT 1
                            FROM likes l
                           WHERE likes.post = l.post
                             AND l.username = $3) AS liked
              FROM likes
             WHERE post IN (SELECT key
                              FROM targets)
          GROUP BY post, liked),

          replies
        AS (SELECT parent,
                   COUNT(parent)::int AS replies,
                   EXISTS(SELECT 1
                            FROM replies r
                           WHERE r.author = $3
                             AND r.parent = replies.parent) AS replied
              FROM replies
             WHERE parent IN (SELECT key
                                FROM targets)
          GROUP BY parent, replied),

          reposts
        AS (SELECT targets.key,
                   0 AS reposts,
                   FALSE AS reposted
              FROM targets)

      SELECT posts.key,
             author,
             ENCODE(avatar, 'base64') AS author_avatar,
             content,
             posts.created_at,
             COALESCE(likes, 0) AS likes,
             COALESCE(liked, FALSE) AS liked,
             COALESCE(replies, 0) AS replies,
             COALESCE(replied, FALSE) AS replied,
             COALESCE(reposts, 0) AS reposts,
             COALESCE(reposted, FALSE) AS reposted
        FROM posts
   FULL JOIN likes
          ON likes.post = posts.key
   FULL JOIN replies
          ON replies.parent = posts.key
   FULL JOIN reposts
          ON reposts.key = posts.key
        JOIN users
          ON posts.author = users.username
       WHERE posts.key IN (SELECT key
                             FROM targets) 
    ORDER BY created_at DESC
    ;`,
    values: [following, author, user.username, limit, offset]
  }

  try {
    const result = await db.query(query)
    const posts = result.rows.map(post => ({
      key: post.key,
      author: {
        username: post.author,
        avatar: post.author_avatar
      },
      content: post.content,
      createdAt: post.created_at,
      likes: {
        count: post.likes,
        hasLiked: post.liked
      },
      replies: {
        count: post.replies,
        hasReplied: post.replied
      },
      reposts: {
        count: post.reposts,
        hasReposted: post.reposted
      }
    }))

    res.send(posts)
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// create a new post
router.post('/', checkContent(3), async (req, res) => {
  const { user } = res.locals
  const { content = '' } = req.body

  const query = {
    text: `
      INSERT INTO posts(author, content) 
           VALUES ($1, $2) 
        RETURNING *
    ;`,
    values: [user.username, content]
  }

  try {
    const result = await db.query(query)
    res.status(201).send(result.rows[0])
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
})

// get trending posts for today
// this will get up to 5 of the most liked posts in the last 24 hours
// router.get('/trending', async (req, res) => {
//   const query = `
//   SELECT key, author, content, total_likes FROM posts JOIN
//     (SELECT post, COUNT(post) as total_likes FROM likes
//       WHERE created_at > current_date - interval '24' hour
//       GROUP BY post ORDER BY total_likes DESC LIMIT 5) AS likes
//     ON post=key ORDER BY total_likes DESC;`

//   try {
//     const result = await db.query(query)
//     res.send(result.rows)
//   } catch (err) {
//     if (err instanceof pg.DatabaseError) {
//       console.error(err)
//       res.status(500).send({ err: 'Unknown error occurred.' })
//     } else throw err
//   }
// })

// get a post by its key
router.get('/:key', getPost, async (req, res) => {
  res.send(res.locals.post)
})

// modify the content of a post that you own
// router.patch('/:key', getPost, checkPrivilege, async (req, res) => {
//   const { content = '' } = req.body
//   if (content === '' || content.length < 3) {
//     res.status(400).send({ err: 'Content must be longer than 3 chars.' })
//     return
//   }

//   const { post } = res.locals
//   if (post.content === content) {
//     res.status(400).send({ err: 'Content is the same.' })
//     return
//   }

//   const query = {
//     text: 'UPDATE posts SET content = $1 WHERE key = $2',
//     values: [content, post.key]
//   }

//   try {
//     const result = await db.query(query)
//     if (result.rowCount === 1) res.status(200).send({ msg: 'Post has been modified.' })
//     else res.status(500).send({ err: 'Post could not be modified.' })
//   } catch (err) {
//     if (err instanceof pg.DatabaseError) {
//       console.error(err)
//       res.status(500).send({ err: 'Unknown error occurred.' })
//     } else throw err
//   }
// })

// delete a post that you own
// router.delete('/:key', getPost, checkPrivilege, async (req, res) => {
//   const query = {
//     text: 'DELETE FROM posts WHERE key = $1',
//     values: [res.locals.post.key]
//   }

//   try {
//     const result = await db.query(query)
//     if (result.rowCount === 1) res.status(200).send({ msg: 'Post has been deleted.' })
//     else res.status(500).send({ err: 'Post could not be deleted.' })
//   } catch (err) {
//     if (err instanceof pg.DatabaseError) {
//       console.error(err)
//       res.status(500).send({ err: 'Unknown error occurred.' })
//     } else throw err
//   }
// })

export default router
