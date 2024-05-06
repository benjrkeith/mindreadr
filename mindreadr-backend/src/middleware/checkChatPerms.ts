import { type Request, type Response, type NextFunction as NF } from 'express'

import db from '../db.js'
import { type User } from '../types.js'

// checks that the provided chat id is a number
// also checks the current user has permission to access the chat
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const user = res.locals.user as User
  const { chat } = req.params

  if (isNaN(parseInt(chat))) {
    res.sendStatus(400)
    return
  }

  const query = {
    text: `
      SELECT 1
        FROM chat_members
       WHERE username = $1
         AND key = $2
    ;`,
    values: [user.username, chat]
  }

  const result = await db.query(query)
  if (result.rowCount !== 1) {
    res.sendStatus(403)
    return
  }

  next()
}
