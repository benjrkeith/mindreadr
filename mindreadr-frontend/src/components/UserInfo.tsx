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
        <img src='cover.jpg' alt='' className='user-img-cover' />
        <div className="user-info-inner-container">
          <img src='default-avatar.png' alt='' className='user-img-avatar' />
          <h1 className='user-info-name'>Ben Keith</h1>
          <h2 className='user-info-username'>@{user.username}</h2>
          <p className='user-info-loc'>No location given.</p>
          <tr className='user-info-table'>
            <td className='user-info-table-data'>Last Active</td>
            <td className='user-info-table-data'>{lastLogin}</td>
          </tr>
          <tr className='user-info-table'>
            <td className='user-info-table-data'>Account Created</td>
            <td className='user-info-table-data'>{createdAt}</td>
          </tr>
        </div>
      </div>
      <div className='user-posts-container'>

      </div>
    </div>
  )
}
