import { type Request, type Response, type NextFunction } from 'express'

import db from '../db.js'

// middleware to check that the requesting user has permission to perform the action
// 0 - standard user
// 1 - admin
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { post, user } = res.locals
  if (post.author === user.username) { next(); return }

  const query = {
    text: 'SELECT privilege FROM users WHERE username = $1;',
    values: [user.username]
  }
  const result = (await db.query(query)).rows[0]

  if (result.privilege > 0) {
    const query = {
      text: 'INSERT INTO audit(username, method, route, data) VALUES($1, $2, $3, $4);',
      values: [user.username, req.method, req.originalUrl, req.body]
    }
    await db.query(query)
    next()
  } else res.sendStatus(401)
}
