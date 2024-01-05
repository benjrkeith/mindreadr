import { type Request, type Response, type NextFunction } from 'express'

import db from '../db.js'

// middleware to get the user object from the db
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.params
  const query = {
    text: 'SELECT username, created_at, last_login, privilege FROM users WHERE username = $1',
    values: [username]
  }

  const result = await db.query(query)
  if (result.rowCount === 0) res.sendStatus(404)
  else {
    res.locals.targetUser = result.rows[0]
    next()
  }
}
