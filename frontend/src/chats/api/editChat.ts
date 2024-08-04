import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { CHATS_URL } from 'src/chats/api'
import { types } from 'src/common'

export interface EditChatDto {
  name?: string
  addUsers: number[]
  removeUsers: number[]
}

export async function editChat(
  chatId: number,
  dto: EditChatDto,
): Promise<types.Chat> {
  const url = `${CHATS_URL}/${chatId}`
  const args = { headers: getHeader() }

  const response = await axios.patch(url, dto, args)
  return response.data
}
