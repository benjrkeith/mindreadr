import { type Request, type Response, type NextFunction } from 'express'

// middleware to parse the offset and limit query params into ints
export default (req: Request, res: Response, next: NextFunction): void => {
  const { offset, limit } = req.query

  let parsedOffset = parseInt(offset as string)
  if (offset === undefined) { parsedOffset = 0 } else if (isNaN(parsedOffset)) {
    res.status(400).send({ err: 'Offset must be a number.' })
    return
  }

  let parsedLimit = parseInt(limit as string)
  if (limit === undefined) { parsedLimit = 10 } else if (isNaN(parsedLimit)) {
    res.status(400).send({ err: 'Limit must be a number.' })
    return
  }
  if (parsedLimit > 100) { parsedLimit = 100 }

  res.locals.offset = parsedOffset
  res.locals.limit = parsedLimit
  next()
}
