import { type Request, type Response, type NextFunction } from 'express'
import pg from 'pg'

import db from '../db.js'
import { type Post, type User } from '../types.js'

// check that the requesting user has permission to perform the action
// 0 - standard user
// 1 - admin
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = res.locals.user as User
  const post = res.locals.post as Post

  if (post.author.username === user.username) {
    next()
    return
  }

  const query = {
    text: `
      SELECT privilege 
        FROM users 
       WHERE username = $1
    ;`,
    values: [user.username]
  }

  try {
    const result = await db.query(query)
    const privilege = result.rows[0].privilege

    if (privilege === 0) {
      res.sendStatus(401)
      return
    }

    const auditQuery = {
      text: `
        INSERT INTO audit(username, method, route, data) 
             VALUES ($1, $2, $3, $4)
      ;`,
      values: [user.username, req.method, req.originalUrl, req.body]
    }
    await db.query(auditQuery)
    next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      res.sendStatus(500)
    } else throw err
  }
}
