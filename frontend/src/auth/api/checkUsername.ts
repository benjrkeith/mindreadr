import { instance as axios } from 'src/common'

import { EXISTS_URL } from 'src/auth/api'
import { getHeader } from 'src/auth/services'

export function checkUsername(username: string) {
  const args = { headers: getHeader() }
  return axios.get(`${EXISTS_URL}/${username}`, args)
}
