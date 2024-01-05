import { type Request, type Response, type NextFunction } from 'express'

// middleware to parse the offset and limit into ints
export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { offset, limit } = req.query

  let parsedOffset = parseInt(offset as string)
  if (offset === undefined) { parsedOffset = 0 } else if (isNaN(parsedOffset)) {
    res.sendStatus(400)
    return
  }

  let parsedLimit = parseInt(limit as string)
  if (limit === undefined) { parsedLimit = 10 } else if (isNaN(parsedLimit)) {
    res.sendStatus(400)
    return
  }
  if (parsedLimit > 100) { parsedLimit = 100 }

  res.locals.offset = parsedOffset
  res.locals.limit = parsedLimit
  next()
}
