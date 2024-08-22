import { getHeader } from 'src/auth'
import { instance as axios } from 'src/common'
import { USERS_URL } from 'src/users/api'

export async function unFollowUser(userId: number) {
  const args = { headers: getHeader() }
  const url = `${USERS_URL}/${userId}/followers`
  const res = await axios.delete(url, args)
  return res.data
}
