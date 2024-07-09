import axios from 'axios'

import { REGISTER_URL } from 'src/auth/api'
import { types } from 'src/common'

export interface RegisterDto {
  name: string
  username: string
  password: string
}

export async function register(dto: RegisterDto): Promise<types.User> {
  const res = await axios.post(REGISTER_URL, dto)
  return res.data
}
