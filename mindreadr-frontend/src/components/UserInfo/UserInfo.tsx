import React, { useEffect, type ReactElement, useState, useCallback } from 'react'

import { type User } from '../../App'
import getUser from '../../api/getUser'
import './UserInfo.css'

interface Props {
  user: string
}

export default function UserInfo (props: Props): ReactElement {
  const [user, setUser] = useState<User>()

  const fetchUser = useCallback(async () => {
    setUser(await getUser(props.user))
  }, [props.user])

  useEffect(() => {
    void fetchUser()
  }, [fetchUser])

  return user === undefined
    ? <></>
    : (
    <div id='user-info'>
      <div id='user-info-top'>
        <img src='cover.jpg' alt='' id='user-info-cover' />
        <img src='default-avatar.png' alt='' id='user-info-avatar' />
        <div id='user-info-names'>
          <h1>Ben Keith</h1>
          <h3>@{user.username}</h3>
        </div>
      </div>
      <div id='user-info-bot'>
          <div className='user-info-stat'>
            <h1>{user.posts}</h1>
            <p>Posts</p>
          </div>
          <div className='user-info-stat'>
            <h1>{user.followers}</h1>
            <p>Followers</p>
          </div>
          <div className='user-info-stat'>
            <h1>{user.following}</h1>
            <p>Following</p>
          </div>
        </div>
      </div>
      )
}
