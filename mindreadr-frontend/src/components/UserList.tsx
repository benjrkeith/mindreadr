import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

import { type User } from '../api/common'

interface Props {
  users: User[]
}

export default function UserList ({ users }: Props): ReactElement {
  return (
    <div className='flex flex-col gap-1 p-2 w-full'>
      {users.map((user, i) =>
        <Link to={`/users/${user.username}`} key={i} className={`w-full 
            flex gap-3 p-1 rounded-xl ${i % 2 === 0 && 'bg-zinc-900'}`}>
          <img src={user.avatar} className='w-1/6 rounded-full'/>
          <h1 className='text-xl h-fit my-auto'>{user.username}</h1>
        </Link>
      )}
    </div>
  )
}
