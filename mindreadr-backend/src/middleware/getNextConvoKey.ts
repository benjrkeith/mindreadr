import { type Request, type Response, type NextFunction as NF } from 'express'
import pg from 'pg'

import db from '../db.js'

// middleware to get the next key than can be used for a new conversation
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const query = { text: 'SELECT MAX(key) FROM conversations' }

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) res.sendStatus(500)
    else {
      const maxKey = result.rows[0].max
      res.locals.nextKey = maxKey === null ? 1 : maxKey + 1
      next()
    }
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
}
