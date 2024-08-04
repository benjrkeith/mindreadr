import axios from 'axios'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export interface CreateChatDto {
  user: types.User
}

export async function createChat({ user }: CreateChatDto): Promise<types.Chat> {
  const body = { name: user.username, users: [user.id] }
  const response = await axios.post(CHATS_URL, body, { headers: getHeader() })
  return response.data
}
