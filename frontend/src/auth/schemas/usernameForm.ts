import { z } from 'zod'

export const usernameSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is empty')
    .max(24, 'Username is too long'),
})
