import axios from 'axios'

import { getHeader } from 'src/auth'
import { types } from 'src/common'
import { USERS_URL } from 'src/users/api'

export async function getUser(username: string): Promise<types.User> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${USERS_URL}/${username}`, args)
  return response.data
}
