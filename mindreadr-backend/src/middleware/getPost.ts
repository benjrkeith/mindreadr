import { type Request, type Response, type NextFunction } from 'express'

import db from '../db.js'

// middleware to get the post object from the db
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { key } = req.params
  if (isNaN(parseInt(key))) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: 'SELECT * FROM posts WHERE key = $1',
    values: [key]
  }

  const result = await db.query(query)
  if (result.rowCount === 0) res.sendStatus(404)
  else {
    res.locals.post = result.rows[0]
    next()
  }
}
