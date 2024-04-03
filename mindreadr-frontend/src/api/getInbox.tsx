import axios from 'axios'

import { INBOX_URL, type Msg } from './common'
import { getHeader } from '../services/auth'

interface Chat {
  key: number
  read: boolean
  users: string[]
  lastMsg: Msg
}

export default async (): Promise<Chat[]> => {
  const args = { headers: getHeader() }
  const res = await axios.get(INBOX_URL, args)
  return res.data
}
