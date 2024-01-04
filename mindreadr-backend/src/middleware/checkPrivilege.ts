import { type Request, type Response, type NextFunction } from 'express'

// middleware to check that the requesting user has permission to perform the action
// 0 - standard user
// 1 - admin
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { post, user } = res.locals
  if (post.author === user.username || user.role > 0) next()
  else res.sendStatus(401)
}
