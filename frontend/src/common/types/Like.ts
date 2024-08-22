import { types } from 'src/common'

export interface Like {
  id: number
  postId: number
  userId: number
  createdAt: string
  user?: types.User
}
