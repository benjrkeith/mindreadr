export const API_URL = '/api'
export const AUTH_URL = `${API_URL}/auth`
export const POSTS_URL = `${API_URL}/posts`
export const USERS_URL = `${API_URL}/users`
export const INBOX_URL = `${API_URL}/inbox`

export interface User {
  username: string
  avatar: string
}

export interface Msg {
  key: number
  chat?: number
  author: User
  content: string
  createdAt: string
}

export interface Chat {
  key: number
  read: boolean
  users: string[]
  lastMsg: Msg
}
