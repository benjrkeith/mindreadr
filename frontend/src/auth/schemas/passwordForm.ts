import { z } from 'zod'

const password = z
  .string()
  .min(4, 'Password is too short')
  .max(32, 'Password is too long')

export const passwordSchema = z.object({
  password: password,
  confirm: password,
})
