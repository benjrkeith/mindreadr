import axios from 'axios'

import { getHeader } from '../services/auth'
import { INBOX_URL } from './common'
import { type MessageInfo } from './getMessages'

export default async function createMessage (conversation: number, content: string):
Promise<MessageInfo> {
  const args = { headers: getHeader() }
  const body = { content }

  const response = await axios.post(`${INBOX_URL}/${conversation}`, body, args)
  return response.data
}
