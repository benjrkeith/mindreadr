import React, { useEffect, type ReactElement, useState, useCallback } from 'react'

import { type User } from '../App'
import Followers from './Followers'
import Following from './Following'
import getUser from '../api/getUser'

interface Props {
  user: string
}

export default function UserInfo (props: Props): ReactElement {
  const [user, setUser] = useState<User>()
  const [showFollowers, setShowFollowers] = useState<boolean>(false)
  const [showFollowing, setShowFollowing] = useState<boolean>(false)

  const fetchUser = useCallback(async () => {
    setUser(await getUser(props.user))
  }, [props.user])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser])

  if (user === undefined) return <></>

  return (
    <>
      <Following target={props.user} showFollowing={showFollowing} setShowFollowing={setShowFollowing}/>
      <Followers target={props.user} showFollowers={showFollowers} setShowFollowers={setShowFollowers}/>
      <div className='flex flex-col'>
        <div className='h-full border-b-2 border-white border-double grid grid-rows-8
            grid-cols-1 justify-items-center'>
          <img src='/cover.jpg' alt=''
            className='h-full w-full object-cover row-[1/9] col-[1] opacity-15 -z-10' />
          <img src='/default-avatar.png' alt=''
            className='h-[90%] row-[2/7] col-[1] rounded-full outline-double outline-white outline-2' />
          <div className='text-white text-center row-[7/9] col-[1]'>
            <h1>Ben Keith</h1>
            <h3>@{user.username}</h3>
          </div>
        </div>
        <div className='grid grid-cols-3 text-center text-white p-4 box-border w-full justify-items-center'>
          <div className='border-2 border-white border-double rounded-md p-2 w-4/5'>
            <h1 className='text-2xl'>{user.posts}</h1>
            <p className='text-xs'>Posts</p>
          </div>
          <button onClick={() => { setShowFollowers(true) }}
              className='border-2 border-white border-double rounded-md p-2 w-4/5'>
            <h1 className='text-2xl'>{user.followers}</h1>
            <p className='text-xs'>Followers</p>
          </button>
          <button onClick={() => { setShowFollowing(true) }} className='border-2 border-white border-double rounded-md p-2 w-4/5'>
            <h1 className='text-2xl'>{user.following}</h1>
            <p className='text-xs'>Following</p>
          </button>
        </div>
      </div>
    </>
  )
}
