import axios from 'axios'

import { INBOX_URL, type Msg } from './common'
import { getHeader } from '../services/auth'

export default async (chat: number): Promise<Msg[]> => {
  const args = { headers: getHeader() }
  const res = await axios.get(`${INBOX_URL}/${chat}`, args)
  return res.data
}
