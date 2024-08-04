import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export async function getChats(): Promise<types.Chat[]> {
  const args = { headers: getHeader() }
  const res = await axios.get(CHATS_URL, args)
  return res.data
}
