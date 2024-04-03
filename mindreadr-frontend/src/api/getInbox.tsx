import axios from 'axios'

import { INBOX_URL, type Chat } from './common'
import { getHeader } from '../services/auth'

export default async (): Promise<Chat[]> => {
  const args = { headers: getHeader() }
  const res = await axios.get(INBOX_URL, args)
  return res.data
}
