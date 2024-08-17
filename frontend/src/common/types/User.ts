export interface User {
  id: number
  username: string
  avatar: string
  token?: string
  cover?: string
  name?: string
  followers?: Follower[]
}

interface Follower {
  id: number
  userId: number
  followerId: number
}
