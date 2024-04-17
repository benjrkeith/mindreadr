import { type Request, type Response, type NextFunction as NF } from 'express'

// checks that a username and password were provided
export default async (req: Request, res: Response, next: NF): Promise<void> => {
  const { username = '', password = '' } = req.body

  if (username === '' || password === '') {
    res.sendStatus(400)
    return
  }

  next()
}
