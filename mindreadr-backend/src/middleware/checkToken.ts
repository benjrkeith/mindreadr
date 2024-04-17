import { type Request, type Response, type NextFunction as NF } from 'express'
import jwt from 'jsonwebtoken'

import secret from '../config/auth.js'

// check a token provided by the client is valid
// decode the username from token
export default (req: Request, res: Response, next: NF): void => {
  const token = req.headers.token as string

  if (token === '' || token === undefined) {
    res.sendStatus(400)
    return
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err !== null || decoded === undefined) {
      res.sendStatus(401)
      return
    }

    res.locals.user = decoded
    next()
  })
}
