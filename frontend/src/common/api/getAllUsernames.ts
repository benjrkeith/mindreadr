import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { types } from 'src/common'
import { USERS_URL } from 'src/common/api'

export async function getAllUsernames(): Promise<types.User[]> {
  const args = { headers: getHeader() }
  const response = await axios.get(USERS_URL, args)
  return response.data
}
