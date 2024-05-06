export interface User {
  username: string
  password?: string
  privilege?: number
  createdAt?: Date
  lastLogin?: Date
  avatar?: string
  postCount?: number
  followerCount?: number
  followingCount?: number
}

export interface Msg {
  key: number
  chat: number
  author: User
  content: string
  createdAt: string
  system: boolean
}

export interface Chat {
  key: number
  read: boolean
  name: string
  msgs: Msg[]
  users: User[]
}

export interface Post {
  key: number
  author: User
  content: string
  createdAt: string
  likes: {
    count: number
    liked: boolean
  }
  reposts: {
    count: number
    reposted: boolean
  }
  replies: {
    count: number
    replied: boolean
  }
}
