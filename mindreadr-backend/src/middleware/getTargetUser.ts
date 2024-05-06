import { type Request, type Response, type NextFunction as NF } from 'express'
import pg from 'pg'

import db from '../db.js'
import { type User } from '../types.js'

// get the target user object from the db
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const { target } = req.params

  const query = {
    text: `
      SELECT username,
             created_at,
             last_login,
             ENCODE(avatar, 'base64') AS avatar,
             (SELECT COUNT(key)
                FROM posts
               WHERE username = $1) AS post_count,
             (SELECT COUNT(username)
                FROM followers
               WHERE username = $1) AS follower_count,
             (SELECT COUNT(follower)
                FROM followers
               WHERE follower = $1) AS following_count
        FROM users
       WHERE username = $1
    ;`,
    values: [target]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) {
      res.sendStatus(404)
      return
    }

    const user: User = {
      ...result.rows[0],
      createdAt: result.rows[0].created_at,
      lastLogin: result.rows[0].last_login,
      postCount: result.rows[0].post_count,
      followerCount: result.rows[0].follower_count,
      followingCount: result.rows[0].following_count
    }

    res.locals.target = user
    next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
}
