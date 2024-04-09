import axios from 'axios'

import { type User, USERS_URL } from './common'
import { getHeader } from '../services/auth'

export default async (target: string): Promise<User[]> => {
  const url = `${USERS_URL}/${target}/followers`
  const args = { headers: getHeader() }
  const res = await axios.get(url, args)
  return res.data
}
