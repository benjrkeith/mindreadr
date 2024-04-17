import { type Request, type Response, type NextFunction as NF } from 'express'

// parse and check the offset and limit query params
export default (req: Request, res: Response, next: NF): void => {
  let { offset = 0, limit = 10 } = req.query

  offset = parseInt(offset as string)
  limit = parseInt(limit as string)

  if (isNaN(offset) || isNaN(limit)) {
    res.sendStatus(400)
    return
  }

  if (limit > 100) limit = 100

  res.locals.offset = offset
  res.locals.limit = limit

  next()
}
