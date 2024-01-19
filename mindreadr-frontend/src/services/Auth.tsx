import { type User, defaultUser } from '../App'

export function logOut (): void {
  sessionStorage.removeItem('user')
}

export function acquireUser (): User {
  const cache = sessionStorage.getItem('user')

  if (cache !== null) { return JSON.parse(cache) } else { return defaultUser }
}

export function getHeader (): Record<string, string> {
  const user = acquireUser()
  return { token: user.token }
}
