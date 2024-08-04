import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export async function getChat(id: number): Promise<types.Chat> {
  const url = `${CHATS_URL}/${id}`
  const args = { headers: getHeader() }

  const res = await axios.get(url, args)
  res.data.messages.reverse()
  return res.data
}
