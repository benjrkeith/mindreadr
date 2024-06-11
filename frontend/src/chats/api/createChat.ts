import axios from 'axios'

import { getHeader } from 'src/auth/services'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export async function createChat(
  name: string,
  users: number[],
): Promise<types.Chat> {
  const body = { name, users }
  const args = { headers: getHeader() }
  const response = await axios.post(CHATS_URL, body, args)
  return response.data
}
