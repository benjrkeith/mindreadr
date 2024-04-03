import { type Request, type Response, type NextFunction as NF } from 'express'
import pg from 'pg'

import db from '../db.js'

// middleware to get the next key than can be used for a new chat
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const query = `
    SELECT MAX(key) AS key 
      FROM conversations
  ;`

  try {
    const result = await db.query(query)
    if (result.rowCount === 0) res.sendStatus(500)
    else {
      const key = result.rows[0].key
      res.locals.nextKey = key === null ? 1 : key + 1
      next()
    }
  } catch (err) {
    if (err instanceof pg.DatabaseError) {
      console.error(err)
      res.sendStatus(500)
    } else throw err
  }
}
