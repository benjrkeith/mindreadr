import axios from 'axios'

import { REGISTER_URL } from 'src/auth/api'
import { types } from 'src/common'

export async function register(
  username: string,
  password: string,
): Promise<types.User> {
  const body = { username, password }
  const res = await axios.post(REGISTER_URL, body)
  return res.data
}
