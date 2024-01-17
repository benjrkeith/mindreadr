import { type User, defaultUser } from '../App'

interface Header {
  headers: {
    token: string
  }
}

export function logOut (): void {
  sessionStorage.removeItem('user')
}

export function acquireUser (): User {
  const cache = sessionStorage.getItem('user')

  if (cache !== null) { return JSON.parse(cache) } else { return defaultUser }
}

export function header (): Header {
  const user = acquireUser()
  return { headers: { token: user.token } }
}
