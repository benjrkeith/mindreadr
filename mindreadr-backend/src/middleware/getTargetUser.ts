import { type Request, type Response, type NextFunction } from 'express'
import pg from 'pg'

import db from '../db.js'

// middleware to get the target user object from the db
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username } = req.params

  if (username === ':username') {
    res.status(400).send({ err: 'You must provide a username.' })
    return
  }

  const query = {
    text: `SELECT username, created_at, last_login, privilege,
            (SELECT COUNT(key) AS posts FROM posts WHERE author = $1),
            (SELECT COUNT(username) AS followers FROM followers WHERE username = $1),
            (SELECT COUNT(follower) AS following FROM followers WHERE follower = $1)
            FROM users WHERE username = $1`,
    values: [username]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) res.status(404).send({ err: 'User could not be found.' })
    else {
      res.locals.targetUser = result.rows[0]
      next()
    }
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send()
    } else throw err
  }
}
