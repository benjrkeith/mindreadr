import React, { type ReactElement } from 'react'
import UserInfo from '../components/UserInfo/UserInfo'
import { useParams } from 'react-router-dom'
// import Feed from '../components/Feed'

export default function Users (): ReactElement {
  const params = useParams()
  const target = params['*'] === '' ? 'user1' : params['*']

  if (target === undefined) return <></>

  return (
  <div id='users-page'>
    <UserInfo user={target}/>
    {/* <Feed user={user.username}/> */}
  </div>

  )
}
