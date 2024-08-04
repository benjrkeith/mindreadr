import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export async function getMessages(
  id: number,
  skip: number,
  take: number,
): Promise<types.Message[]> {
  const url = `${CHATS_URL}/${id}/messages`
  const args = { headers: getHeader(), params: { skip, take } }

  const res = await axios.get(url, args)
  res.data.reverse()
  return res.data
}
