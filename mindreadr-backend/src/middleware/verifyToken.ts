import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import secret from '../config/auth.js'

// verifies that a token provided by the client is valid
// decodes the account id from token
export default (req: Request, res: Response, next: NextFunction): void => {
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
