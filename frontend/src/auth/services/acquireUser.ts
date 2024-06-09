import { types } from 'src/common'
import { defaultUser } from 'src/store'

export function acquireUser(): types.User {
  const cache = sessionStorage.getItem('user')
  if (!cache) return defaultUser

  const user = JSON.parse(cache)

  if (user.token !== '') {
    return user
  } else return defaultUser
}
