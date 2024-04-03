import axios from 'axios'

import { INBOX_URL, type Msg } from './common'
import { getHeader } from '../services/auth'

export default async (chat: number, content: string): Promise<Msg> => {
  const url = `${INBOX_URL}/${chat}`
  const body = { content }
  const args = { headers: getHeader() }

  const res = await axios.post(url, body, args)
  return res.data
}
