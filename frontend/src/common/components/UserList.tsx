import { useNavigate } from 'react-router-dom'

import { types } from 'src/common'

interface UserListProps {
  users: types.User[]
  onClick?: (user: types.User) => void
}

export function UserList(props: UserListProps) {
  let { users, onClick } = props
  users = users.slice(0, 24)

  const navigate = useNavigate()

  // default callback is link to user profile
  if (onClick === undefined)
    onClick = (user: types.User) => navigate(`/users/${user.username}`)

  return (
    <div className='flex w-full flex-col gap-1 overflow-scroll p-1'>
      {users.map((user) => (
        <button
          key={user.username}
          onClick={() => onClick(user)}
          className='flex w-full gap-3 rounded-md border-none px-2 py-1 
          hover:bg-dark_bg_1dp'
        >
          <img
            src={user.avatar}
            alt={user.username}
            className='aspect-square w-1/6 rounded-full object-cover 
            shadow-[0px_0px_20px] shadow-black/30'
          />

          <h1 className='my-auto text-xl'>{user.username}</h1>
        </button>
      ))}

      {!Boolean(users.length) && (
        <span className='py-3 text-center font-medium'>No users found</span>
      )}
    </div>
  )
}
