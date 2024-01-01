import { type Request, type Response, type NextFunction } from 'express'

import db from '../db.js'

// checks if a given username exists in the database
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const username = req.body.username
  const query = 'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)'

  const client = await db.connect()
  const result = await client.query(query, [username])

  if (result.rows[0].exists as boolean) res.sendStatus(409)
  else next()
}
