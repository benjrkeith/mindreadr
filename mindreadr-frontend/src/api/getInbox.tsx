import axios from 'axios'

import { INBOX_URL } from './common'
import { getHeader } from '../services/auth'

export interface Conversation {
  lastMessage: number
  conversation: number
  author: string
  content: string
  created_at: string
  avatar: string
  users: string[]
}

export default async function getInbox (): Promise<Conversation[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(INBOX_URL, args)
  return response.data
}
