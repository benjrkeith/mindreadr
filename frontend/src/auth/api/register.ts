import { instance as axios } from 'src/common'

import { REGISTER_URL } from 'src/auth/api'
import { types } from 'src/common'

export interface RegisterDto {
  username: string
  password: string
}

export async function register(dto: RegisterDto): Promise<types.User> {
  const res = await axios.post(REGISTER_URL, dto)
  return res.data
}
