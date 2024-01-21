import React, { type ReactElement, useContext } from 'react'
import { userCtx, type User } from '../App'
import UserInfo from '../components/UserInfo'
import Feed from '../components/Feed'

export default function Users (): ReactElement {
  const user: User = useContext(userCtx)

  return (
  <div className="users-page-container">
    <UserInfo user={user}/>
    <Feed user={user.username}/>
  </div>

  )
}
