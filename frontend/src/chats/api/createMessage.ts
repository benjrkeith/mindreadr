import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export interface NewMessageDto {
  chatId: number
  content: string
}

export async function createMessage(
  dto: NewMessageDto,
): Promise<types.Message> {
  const url = `${CHATS_URL}/${dto.chatId}/messages`
  const body = { content: dto.content }
  const args = { headers: getHeader() }

  const res = await axios.post(url, body, args)
  return res.data
}
