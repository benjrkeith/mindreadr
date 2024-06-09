import { User } from 'src/common/types/User'

export type Message = {
  id: number
  content: string
  createdAt: string
  author: User
  system: boolean
}
