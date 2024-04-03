import axios from 'axios'

import { getHeader } from '../services/auth'
import { INBOX_URL } from './common'

export default async function createConversation (users: string[]): Promise<void> {
  const userString = users.join('&')
  const args = { headers: getHeader(), params: { users: userString } }
  let response = await axios.post(INBOX_URL, {}, args)
  const conversation = response.data.conversation_key

  const args2 = { headers: getHeader() }
  const body = { content: 'I created a new conversation.' }
  response = await axios.post(`${INBOX_URL}/${conversation}`, body, args2)
  return response.data
}
