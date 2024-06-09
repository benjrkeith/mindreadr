import { ChatMember } from 'src/common/types/ChatMember'
import { Message } from 'src/common/types/Message'

export type Chat = {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  members: ChatMember[]
  messages: Message[]
  fetched: boolean
}
