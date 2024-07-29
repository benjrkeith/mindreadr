import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is empty')
    .max(24, 'Username is too long'),
  password: z
    .string()
    .min(1, 'Password is empty')
    .max(32, 'Password is too long'),
})
