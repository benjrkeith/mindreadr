import { acquireUser } from 'src/auth/services/acquireUser'

export function getHeader(): Record<string, string> {
  const user = acquireUser()
  if (user.token === '') return {}
  else return { Authorization: `Bearer ${user.token}` }
}
