import { followUser } from 'src/users/api/followUser'
import { unFollowUser } from 'src/users/api/unfollowUser'

interface args {
  id: number
  isFollowing: boolean
}

export async function toggleFollowUser({ id, isFollowing }: args) {
  if (isFollowing) {
    return await unFollowUser(id)
  } else {
    return await followUser(id)
  }
}
