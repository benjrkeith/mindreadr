import { User } from 'src/common/types/User'

export type ChatMember = {
  id: number
  createdAt: string
  chatId: number
  user: User
  isRead: boolean
}
