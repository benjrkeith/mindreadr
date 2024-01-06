import { type Request, type Response, type NextFunction } from 'express'
import pg from 'pg'

import db from '../db.js'

// middleware to get the post object from the db
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { key } = req.params
  if (isNaN(parseInt(key))) {
    res.status(400).send({ err: 'Post key must be a number.' })
    return
  }

  const query = {
    text: `SELECT *, (SELECT COUNT(*) AS likes FROM likes WHERE post=key), 
      EXISTS(SELECT * FROM likes WHERE username=$1 AND post=key) AS liked 
      FROM posts WHERE key = $2`,
    values: [res.locals.user.username, key]
  }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) res.status(404).send({ err: 'Post could not be found.' })
    else {
      res.locals.post = result.rows[0]
      next()
    }
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.status(500).send({ err: 'Unknown error occurred.' })
    } else throw err
  }
}
