import { type Request, type Response, type NextFunction } from 'express'
import pg from 'pg'

import db from '../db.js'

// middleware to get a list of a users followers
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { user, targetUser } = res.locals
  const target = targetUser === undefined ? user : targetUser

  const query = {
    text: 'SELECT username FROM followers WHERE follower = $1',
    values: [target.username]
  }

  try {
    const result = await db.query(query)
    res.locals._following = result.rows.map(x => x.username)
    next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
}
