import { type Request, type Response, type NextFunction as NF } from 'express'

// checks that the provided content is valid
export default (minLength: number) => (req: Request, res: Response, next: NF): void => {
  const { content } = req.body

  if (content === undefined ||
      typeof content !== 'string' ||
      content.length < minLength) {
    res.sendStatus(400)
    return
  }

  next()
}
