import { Router } from 'express'

import db from '../db.js'
import verifyToken from '../middleware/verifyToken.js'
import parseLimits from '../middleware/parseLimits.js'

const router = Router()

router.use(verifyToken)

router.get('/', parseLimits, async (req, res) => {
  const { offset, limit } = res.locals

  const query = {
    text: `SELECT username, created_at, last_login, privilege FROM users 
            ORDER BY created_at LIMIT $1 OFFSET $2`,
    values: [limit, offset]
  }

  const result = await db.query(query)
  res.send(result.rows)
})

export default router
