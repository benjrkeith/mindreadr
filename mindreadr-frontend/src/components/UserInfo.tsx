import React, { useEffect, type ReactElement, useState, useCallback } from 'react'

import { type User } from '../api/common'
import getUser from '../api/getUser'
import StatButton from './StatButton'

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
        <img src={`data:image/jpeg;base64,${user.avatar}`} alt='' className='w-[40%] rounded-2xl' />
        <div className=''>
          <h1 className='text-3xl font-semibold'>Ben Keith</h1>
          <h1 className='text-3xl font-normal'>@{user.username}</h1>
        </div>
      </div>
      <div className='grid grid-cols-3 text-center text-white box-border w-full
          justify-items-center p-1'>
        <StatButton stat={user.posts ?? 0} text='Posts' callback={() => {
          setSelectedTab('posts')
        }}/>
        <StatButton stat={user.followers ?? 0} text='Followers' callback={() => {
          setSelectedTab('followers')
        }}/>
        <StatButton stat={user.following ?? 0} text='Following' callback={() => {
          setSelectedTab('following')
        }}/>
      </div>
    </>
  )
}
