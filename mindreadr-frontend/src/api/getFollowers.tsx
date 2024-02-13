import axios from 'axios'

import { getHeader } from '../services/auth'
import { USERS_URL } from './common'

export async function getFollowers (target: string): Promise<string[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${USERS_URL}/${target}/followers`, args)
  return response.data
}
