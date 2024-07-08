import axios from 'axios'

import { LOGIN_URL } from 'src/auth/api'
import { types } from 'src/common'

export interface LogInDto {
  username: string
  password: string
}

export async function logIn(dto: LogInDto): Promise<types.User> {
  const res = await axios.post(LOGIN_URL, dto)
  return res.data
}
