import { type Request, type Response, type NextFunction } from 'express'
import pg from 'pg'

import db from '../db.js'

// checks if a given username already exists in the database
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.body
  const query = {
    text: 'SELECT EXISTS(SELECT 1 FROM users WHERE username = $1)',
    values: [username]
  }

  try {
    const result = await db.query(query)
    if (result.rows[0].exists as boolean) {
      res.status(409).send({ err: 'Username already registered.' })
    } else next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else { throw err }
  }
}
