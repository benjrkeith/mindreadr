import axios from 'axios'

import { INBOX_URL } from './common'
import { getHeader } from '../services/auth'

export interface MessageInfo {
  key: number
  conversation: number
  author: string
  content: string
  created_at: string
  avatar: string
}

export default async function getMessages (conversation: number): Promise<MessageInfo[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${INBOX_URL}/${conversation}`, args)
  return response.data.reverse()
}
