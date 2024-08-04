import { instance as axios } from 'src/common'

import { getHeader } from 'src/auth'
import { types } from 'src/common'
import { USERS_URL } from 'src/users/api'

interface UserResponse extends types.User {
  _count: {
    followers: number
    following: number
    posts: number
  }
}

export async function getUser(username: string): Promise<UserResponse> {
  const args = { headers: getHeader() }
  const response = await axios.get(`${USERS_URL}/${username}`, args)
  return response.data
}
