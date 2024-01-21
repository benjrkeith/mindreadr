import React, { type ReactElement } from 'react'

import { type User } from '../App'
import './UserInfo.css'

interface Props {
  user: User
}

export default function UserInfo (props: Props): ReactElement {
  const { user } = props
  const createdAt = new Date(user.created_at).toUTCString()
  const lastLogin = new Date(user.last_login).toUTCString()

  return (
    <div className='user-container'>
      <div className='user-info-container'>
        <div className="user-info-outer-container">
          <img src='default-avatar.png' alt='' className='user-info-avatar' />
          <div className="user-info-inner-container">
            <h1 className='user-info-username'>Ben Keith</h1>
            <h2 className='user-info-username'>@{user.username}</h2>
            <p>No location given.</p>
          </div>
        </div>
        <tr className='user-info-table'>
          <td className='user-info-table-data'>Last Active</td>
          <td className='user-info-table-data'>{lastLogin}</td>
        </tr>
        <tr className='user-info-table'>
          <td className='user-info-table-data'>Account Created</td>
          <td className='user-info-table-data'>{createdAt}</td>
        </tr>

      </div>
      <div className='user-posts-container'>

      </div>
    </div>
  )
}
