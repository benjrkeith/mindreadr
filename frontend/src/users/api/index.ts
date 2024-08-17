import { API_URL } from 'src/common'

export const USERS_URL = `${API_URL}/users`

export * from 'src/users/api/getFollowers'
export * from 'src/users/api/getFollowing'
export * from 'src/users/api/getUser'
export * from 'src/users/api/toggleFollowUser'
