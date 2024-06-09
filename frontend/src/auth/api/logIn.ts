import axios from 'axios'

import { LOGIN_URL } from 'src/auth/api'
import { types } from 'src/common'

export async function logIn(
  username: string,
  password: string,
): Promise<types.User> {
  const body = { username, password }
  const res = await axios.post(LOGIN_URL, body)
  return res.data
}
