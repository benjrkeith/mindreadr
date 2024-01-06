import { type Request, type Response, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import secret from '../config/auth.js'

// verifies that a token provided by the client is valid
// decodes the account id from token
export default (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.token as string
  if (token === '' || token === undefined) {
    res.status(400).send({ err: 'Auth token not provided.' })
    return
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err !== null || decoded === undefined) {
      res.status(401).send({ err: 'Auth token is invalid or expired.' })
      return
    }

    res.locals.user = decoded
    next()
  })
}
