import axios from 'axios'

import { type User, USERS_URL } from './common'
import { getHeader } from '../services/auth'

export async function getFollowing (target: string): Promise<User[]> {
  const url = `${USERS_URL}/${target}/following`
  const args = { headers: getHeader() }
  const res = await axios.get(url, args)
  return res.data
}
