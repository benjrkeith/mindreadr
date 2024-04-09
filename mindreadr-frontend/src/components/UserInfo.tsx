import React, { useEffect, type ReactElement, useState, useCallback } from 'react'

import { type User } from '../api/common'
import getUser from '../api/getUser'

interface Props {
  username: string
  setSelectedTab: (tab: string) => void
}

export default function UserInfo ({ username, setSelectedTab }: Props): ReactElement {
  const [user, setUser] = useState<User>()

  const fetchUser = useCallback(async () => {
    setUser(await getUser(username))
  }, [username])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser, username])

  if (user === undefined) return <></>

  return (
    <>
      <div className='flex w-full m-2 gap-2'>
        <img src={user.avatar} alt='' className='w-[40%] rounded-2xl' />
        <div className=''>
          <h1 className='text-3xl font-semibold'>Ben Keith</h1>
          <h1 className='text-3xl font-normal'>@{user.username}</h1>
        </div>
      </div>
      <div className='grid grid-cols-3 text-center text-white box-border w-full justify-items-center p-1'>
        <button onClick={() => { setSelectedTab('posts') }}
         className='bg-zinc-900 rounded-xl p-2 w-4/5'>
          <h1 className='text-xl sm:text-2xl'>{user.posts}</h1>
          <p className=' text-[0.6rem] sm:text-base'>Posts</p>
        </button>
        <button onClick={() => { setSelectedTab('followers') }}
            className='bg-zinc-900 rounded-xl p-2 w-4/5'>
          <h1 className='text-xl sm:text-2xl'>{user.followers}</h1>
          <p className='text-[0.6rem] sm:text-base'>Followers</p>
        </button>
        <button onClick={() => { setSelectedTab('following') }}
        className='bg-zinc-900 rounded-xl p-2 w-4/5'>
          <h1 className='text-xl sm:text-2xl'>{user.following}</h1>
          <p className='text-[0.6rem] sm:text-base'>Following</p>
        </button>
      </div>
    </>
  )
}
