import { type Request, type Response, type NextFunction as NF } from 'express'

// basic error handling to verify all bodys recieved are json
export default (err: Error, req: Request, res: Response, next: NF): void => {
  if (err instanceof SyntaxError) {
    res.status(400).send({ err: 'JSON body is invalid.' })
  } else next()
}
