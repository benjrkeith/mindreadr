import axios from 'axios'

import { type User } from '../App'
import { getHeader } from '../services/Auth'
import { USERS_URL } from './common'

export default async function getUser (username: string): Promise<User> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${USERS_URL}/${username}`, args)
  return response.data
}
