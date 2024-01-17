import React, { type ReactElement, useContext } from 'react'
import { userCtx, type User } from '../App'

const avatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

export default function Users (): ReactElement {
  const user: User = useContext(userCtx)

  return (
    <div className='users-container'>
      <h1 className='users-username'>{user.username}</h1>
      <img className='users-avatar' width={100} src={avatar}/>
      <div className="users-posts-container">

      </div>
    </div>
  )
}
