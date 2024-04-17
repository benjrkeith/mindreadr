import { type Request, type Response, type NextFunction as NF } from 'express'
import pg from 'pg'

import db from '../db.js'

// get a list of people a target user follows
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const { target } = req.params

  const query = {
    text: `
      SELECT followers.username,
             ENCODE(users.avatar, 'base64') AS avatar
        FROM followers 
        JOIN users 
          ON followers.username = users.username
       WHERE follower = $1
    ;`,
    values: [target]
  }

  try {
    const result = await db.query(query)
    res.locals.following = result.rows
    next()
  } catch (err) {
    if (err instanceof pg.DatabaseError) res.sendStatus(500)
    else throw err
  }
}
