import { useQuery } from '@tanstack/react-query'
import { UserList } from 'src/common'

import { useNavigate } from 'react-router-dom'
import { TitleBar } from 'src/titleBar'
import { getFollowing } from 'src/users/api'
import { useUserId } from 'src/users/hooks'

export function FollowingList() {
  const id = useUserId()
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ['users', id, 'following'],
    queryFn: () => getFollowing(id),
  })

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError || query.data === undefined) return <></>
  else
    return (
      <div className='grow'>
        <TitleBar title='Following' goBack={() => navigate(-1)} />
        <UserList users={query.data} />
      </div>
    )
}
