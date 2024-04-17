import { type Request, type Response, type NextFunction as NF } from 'express'

// checks the target user is the same as the authenticated user
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const { user } = res.locals
  const { target } = req.params

  if (user.username !== target) {
    res.sendStatus(403)
    return
  }

  next()
}
