import { types } from 'src/common'

export interface Comment {
  id: number
  postId: number
  content: string
  createdAt: string
  updatedAt: string
  author: types.User
}
