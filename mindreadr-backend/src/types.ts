export interface RawUser {
  username: string
  password: string
  privilege: number
  created_at: string
  last_login: string
  avatar: string
}

export interface User {
  username: string
  privilege: number
  createdAt: Date
  lastLogin: Date
  avatar: string
}
