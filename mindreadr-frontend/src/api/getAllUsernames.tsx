import axios from 'axios'

import { getHeader } from '../services/auth'
import { USERS_URL } from './common'

export interface UserPreview {
  username: string
  avatar: string
}

export async function getAllUsernames (): Promise<UserPreview[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(USERS_URL, args)
  return response.data
}
