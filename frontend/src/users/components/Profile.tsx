import { useQuery } from '@tanstack/react-query'
import { Navigate, useParams } from 'react-router-dom'

import { Button } from 'src/common'
import { Avatar } from 'src/common/components/Avatar'
import { getUser } from 'src/users/api'
import { Stats } from 'src/users/components/Stats'

export function Profile() {
  const { username } = useParams() as { username: string }

  // query for users information
  const query = useQuery({
    queryKey: ['users', username],
    queryFn: () => getUser(username),
  })

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError || query.data === undefined)
    return <Navigate to='/users' />
  else
    return (
      <div className='flex grow flex-col overflow-y-scroll'>
        <Avatar user={query.data} sx='text-[6rem]' />
        <div
          className='mx-auto flex w-3/4 -translate-y-2/4 
          flex-col gap-3 rounded-lg bg-dark_bg_1dp px-2 py-3
          shadow-[0px_0px_20px] shadow-black/60'
        >
          <div
            className='mx-2 grid grid-cols-2 items-center 
            justify-items-center'
          >
            <h1 className='grow text-2xl font-medium leading-7'>
              {query.data.username}
            </h1>

            <Button value='Follow' sx='w-fit p-1 text-xs' />
          </div>

          <Stats count={query.data._count} />
        </div>
      </div>
    )
}
