import { types } from 'src/common'

export function cacheUser(user: types.User): void {
  sessionStorage.setItem('user', JSON.stringify(user))
}
