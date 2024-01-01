import {Request, Response, NextFunction} from 'express'

import db from '../db.js'


// checks if a given username exists in the database
export default async (req: Request, res: Response, next: NextFunction) => {
  const username = req.body.username
  const query = 'SELECT username FROM users WHERE username = $1'

  const client = await db.connect()
  const result = await client.query(query, [username])

  if (result.rows.length !== 0) res.sendStatus(409)
  else next()
}
