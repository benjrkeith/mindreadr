import React, { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { type User } from '../api/common'

interface Props {
  users: User[]
  selected?: string[]
  onClick?: (user: string) => void
}

export default function UserList (props: Props): ReactElement {
  let { users, selected = [], onClick } = props
  const navigate = useNavigate()

  if (onClick === undefined) {
    onClick = (user: string): void => { navigate(`/users/${user}`) }
  }

  return (
    <div className='flex flex-col p-2 pt-0 w-full overflow-scroll'>
      {users.map(({ username, avatar }, i) =>
        <button key={i} className={`w-full flex gap-3 p-[0.35rem] rounded-xl 
        ${i % 2 === 0 && 'bg-zinc-900'}`} onClick={() => { onClick(username) }}>

          <img src={`data:image/jpeg;base64,${avatar}`} className='w-1/6 rounded-full'/>
          <h1 className='text-xl h-fit my-auto grow text-start'>{username}</h1>

          {selected.includes(username) &&
            <p className='text-purple-600 text-3xl font-bold my-auto pr-5'>
              &#10003;
            </p>
          }
        </button>
      )}
    </div>
  )
}
