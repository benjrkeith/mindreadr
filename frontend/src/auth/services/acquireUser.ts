import { emptyUser, types } from 'src/common'

export function acquireUser(): types.User {
  const cache = sessionStorage.getItem('user')
  if (!cache) return emptyUser

  const user = JSON.parse(cache)

  if (user.token !== '') {
    return user
  } else return emptyUser
}
