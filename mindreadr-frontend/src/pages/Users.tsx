import React, { type ReactElement } from 'react'
import UserInfo from '../components/UserInfo'
import { useParams } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
// import Feed from '../components/Feed'

export default function Users (): ReactElement {
  const params = useParams()
  const user = useAuth()

  const target = params['*'] === '' ? user.username : params['*']

  if (target === undefined) return <></>

  return (
  <div className='h-[90%] flex flex-col'>
    <UserInfo user={target}/>
    {/* <Feed user={user.username}/> */}
  </div>

  )
}
