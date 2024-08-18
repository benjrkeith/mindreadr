import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useParams } from 'react-router-dom'

import { useAuth } from 'src/auth'
import { Button, cls } from 'src/common'
import { Avatar } from 'src/common/components/Avatar'
import { getUser, toggleFollowUser } from 'src/users/api'
import { Stats } from 'src/users/components/Stats'
import { UploadAvatar } from 'src/users/components/UploadAvatar'

export function Profile() {
  const { username } = useParams() as { username: string }
  const { user } = useAuth()

  const isOwnProfile = user.username === username

  // query for users information
  const query = useQuery({
    queryKey: ['users', username],
    queryFn: () => getUser(username),
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: toggleFollowUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users', username] })
      queryClient.invalidateQueries({
        queryKey: ['users', query.data?.id, 'followers'],
      })
      queryClient.invalidateQueries({
        queryKey: ['users', query.data?.id, 'following'],
      })
    },
  })

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError || query.data === undefined)
    return <Navigate to='/users' />
  else {
    const followers = query.data.followers || []
    const isFollowing = followers.some((f) => f.followerId === user.id)

    return (
      <div className='flex grow flex-col overflow-y-scroll'>
        {isOwnProfile && <UploadAvatar />}

        <Avatar user={query.data} sx='text-[6rem] size-[100vw]' />

        <div className='relative flex flex-col'>
          <div
            className='z-30 mx-auto flex w-3/4 -translate-y-3/4 flex-col 
            gap-3 rounded-lg bg-dark_bg_1dp px-2 py-3 
            shadow-[0px_0px_20px] shadow-black/60'
          >
            <div
              className='mx-2 grid grid-cols-2 items-center 
              justify-items-center'
            >
              <h1 className='grow text-2xl font-medium leading-7'>
                {query.data.username}
              </h1>

              <Button
                value={isFollowing ? 'UnFollow' : 'Follow'}
                onClick={() =>
                  mutation.mutate({ id: query.data.id, isFollowing })
                }
                sx={cls('w-fit p-1 text-xs', {
                  'outline-error text-error hover:bg-error focus:bg-error':
                    isFollowing,
                })}
              />
            </div>

            <Stats userId={query.data.id} count={query.data._count} />
          </div>
          <div className='absolute z-10 h-1/4 w-full'>
            <div className='h-full'></div>
            <p className=''>TODO ADD USERS POSTS</p>
          </div>
        </div>
      </div>
    )
  }
}
