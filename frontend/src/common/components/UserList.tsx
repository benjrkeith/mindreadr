import { type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { types } from 'src/common'

interface UserListProps {
  users: types.SelectableUser[]
  onClick?: (user: types.SelectableUser) => void
}

export function UserList(props: UserListProps): ReactElement {
  let { users, onClick } = props
  users = users.slice(0, 12)

  const navigate = useNavigate()

  // set default callback to redirect to user profile
  if (onClick === undefined) {
    onClick = (user: Partial<types.User>): void => {
      navigate(`/users/${user.username}`)
    }
  }

  return (
    <div
      tabIndex={-1}
      className='flex w-full flex-col overflow-scroll 
      p-2 pt-0 [&>*:nth-child(even)]:bg-bg1'
    >
      {users.map((user) => (
        <button
          key={user.username}
          onClick={() => {
            onClick(user)
          }}
          className='flex w-full gap-4 rounded-xl border-none p-2
          outline-none focus:text-fg1'
        >
          <img
            src={user.avatar}
            className='aspect-square w-1/6 rounded-full object-cover'
          />

          <h1
            className='my-auto h-fit grow text-start text-2xl hover:text-fg1 
          focus:text-fg1'
          >
            {user.username}
          </h1>

          {user.selected && (
            <p className='my-auto pr-5 text-3xl font-bold text-fg1'>&#10003;</p>
          )}
        </button>
      ))}
    </div>
  )
}
