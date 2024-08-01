import axios from 'axios'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export async function createMessage(
  chatId: number,
  content: string,
): Promise<types.Message> {
  const url = `${CHATS_URL}/${chatId}/messages`
  const body = { content }
  const args = { headers: getHeader() }

  const res = await axios.post(url, body, args)
  return res.data
}
