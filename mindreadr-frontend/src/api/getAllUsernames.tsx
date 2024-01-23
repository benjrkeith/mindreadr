import axios from 'axios'

import { getHeader } from '../services/Auth'
import { USERS_URL } from './common'

export async function getAllUsernames (): Promise<string[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(USERS_URL, args)

  console.log(response.data)
  return response.data
}
