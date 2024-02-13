import axios from 'axios'

import { getHeader } from '../services/auth'
import { USERS_URL } from './common'

export async function getFollowing (target: string): Promise<string[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${USERS_URL}/${target}/following`, args)
  return response.data
}
