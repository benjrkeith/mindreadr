import { type Request, type Response, type NextFunction } from 'express'

// middleware to check that the requesting user has permission to perform the action
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { post } = res.locals
  if (post.author === res.locals.user.username) next()
  else res.sendStatus(401)
}
