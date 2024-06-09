import axios from 'axios'

import { getHeader } from 'src/auth/services'
import { types } from 'src/common'
import { USERS_URL } from 'src/common/api'

export async function getAllUsernames(): Promise<Partial<types.User>[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(USERS_URL, args)
  return response.data
}
