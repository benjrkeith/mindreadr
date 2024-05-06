import { type Request, type Response, type NextFunction as NF } from 'express'
import pg from 'pg'

import db from '../db.js'
import { type Post, type User } from '../types.js'

// get the post object from the db
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const user = res.locals.user as User
  const { key } = req.params

  if (isNaN(parseInt(key))) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: `
      WITH likes
        AS (SELECT post,
                   COUNT(post)::int AS likes,
                   EXISTS(SELECT 1
                            FROM likes l
                           WHERE l.post = $2
                             AND l.username = $1) AS liked
              FROM likes
             WHERE post = $2
          GROUP BY post, liked),

         replies
        AS (SELECT parent,
                   COUNT(parent)::int AS replies,
                   EXISTS(SELECT 1
                            FROM replies r
                           WHERE r.author = $1
                             AND r.parent = $2) AS replied
              FROM replies
             WHERE parent = $2
          GROUP BY parent, replied),

         reposts
        AS (SELECT posts.key,
                   0 AS reposts,
                   FALSE AS reposted
              FROM posts
             WHERE posts.key = $2)

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
       WHERE posts.key = $2
    `,
    values: [user.username, key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) {
      res.sendStatus(404)
      return
    }

    const post: Post = {
      ...result.rows[0],
      author: {
        username: result.rows[0].author,
        avatar: result.rows[0].author_avatar
      },
      createdAt: result.rows[0].created_at,
      likes: {
        count: result.rows[0].likes,
        liked: result.rows[0].liked
      },
      replies: {
        count: result.rows[0].replies,
        replied: result.rows[0].replied
      },
      reposts: {
        count: result.rows[0].reposts,
        reposted: result.rows[0].reposted
      }
    }

    res.locals.post = post
    next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
}
