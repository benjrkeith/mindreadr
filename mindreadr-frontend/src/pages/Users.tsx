import React, { type ReactElement, useContext } from 'react'
import { userCtx, type User } from '../App'
import UserInfo from '../components/UserInfo'

export default function Users (): ReactElement {
  const user: User = useContext(userCtx)

  return (<UserInfo user={user}/>)
}
