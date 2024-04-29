import jwt, { type JwtPayload } from 'jsonwebtoken'
import { type Socket } from 'socket.io'

import secret from '../config/auth.js'

// check a token provided by the client is valid
// decode the username from token
export default async (socket: Socket, next: any): Promise<void> => {
  const token = socket.handshake.headers.token as string

  if (token === '' || token === undefined) {
    socket.disconnect(true)
    return
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err !== null || decoded === undefined) {
      socket.disconnect(true)
      return
    }

    await socket.join((decoded as JwtPayload).username as string)
    next()
  })
}
