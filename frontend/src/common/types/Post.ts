import { types } from 'src/common'

export interface Post {
  id: number
  author: types.User
  content: string
  createdAt: string
  likes: types.Like[]
  comments: types.Comment[]
}
