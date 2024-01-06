import { type Request, type Response, type NextFunction } from 'express'

// basic error handling to verify all bodys recieved are json
export default (err: Error, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ err: 'JSON body is invalid.' })
    return
  }
  next()
}
