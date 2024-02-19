import React, { useEffect, type ReactElement, useState, useCallback } from 'react'

import Followers from './Followers'
import Following from './Following'
import getUser from '../api/getUser'
import { type User } from '../App'

import avatar from '../assets/avatar.png'
import cover from '../assets/cover.jpg'

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
  }, [fetchUser, props.user])

  if (user === undefined) return <></>

  return (
    <>
      <Following target={props.user} showFollowing={showFollowing}
        setShowFollowing={setShowFollowing}/>
      <Followers target={props.user} showFollowers={showFollowers}
        setShowFollowers={setShowFollowers}/>
      <div className='flex flex-col h-4/6'>
        <div className='border-b-2 border-white border-double grid grid-rows-4
            justify-items-center h-2/6 grow'>
          <img src={cover} alt='' className='h-full w-full object-cover
            row-[1/6] col-[1] opacity-15' />
          <div className='row-[1/6] col-[1] z-10 flex flex-col p-3 gap-2 w-full'>
            <img src={avatar} alt='' className='h-[30%] outline-white col-[1]
              rounded-full outline-double row-[1/4] outline-2 self-center grow' />
            <div className='text-white text-center row-[4/4] col-[1] p-1'>
              <h1 className='text-base leading-5 sm:text-xl md:text-2xl'>Ben Keith</h1>
              <h1 className='text-base leading-5 sm:text-xl md:text-2xl'>@{user.username}</h1>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 text-center text-white p-2 box-border
            w-full justify-items-center sm:p-4'>
          <button className='border-2 border-white border-double rounded-md py-1 w-4/5'>
            <h1 className='text-xl sm:text-2xl'>{user.posts}</h1>
            <p className=' text-[0.6rem] sm:text-base'>Posts</p>
          </button>
          <button onClick={() => { setShowFollowers(true) }}
              className='border-2 border-white border-double rounded-md py-1 w-4/5'>
            <h1 className='text-xl sm:text-2xl'>{user.followers}</h1>
            <p className='text-[0.6rem] sm:text-base'>Followers</p>
          </button>
          <button onClick={() => { setShowFollowing(true) }}
          className='border-2 border-white border-double rounded-md py-1 w-4/5'>
            <h1 className='text-xl sm:text-2xl'>{user.following}</h1>
            <p className='text-[0.6rem] sm:text-base'>Following</p>
          </button>
        </div>
      </div>
    </>
  )
}
