import { getHeader } from 'src/auth'
import { USERS_URL, instance as axios } from 'src/common'

export async function getFollowing(userId: number) {
  const url = `${USERS_URL}/${userId}/following`
  const args = { headers: getHeader() }
  const res = await axios.get(url, args)
  return res.data
}
