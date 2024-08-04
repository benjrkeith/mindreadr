import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'

import { types } from 'src/common'
import { getAllUsernames } from 'src/common/api'
import { UserList } from 'src/common/components/UserList'
import { InputBar } from 'src/titleBar'

interface UserSearchProps {
  callback: (user: types.User) => void
  goBack: () => void
}

export function UserSearch({ callback, goBack }: UserSearchProps) {
  const [query, setQuery] = useState('')

  // get all usernames so we can search through them
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getAllUsernames })

  if (usersQuery.isLoading) return <div>Loading...</div>
  else if (usersQuery.isError || usersQuery.data === undefined)
    return <Navigate to='/chats' />
  else {
    const filtered = usersQuery.data.filter(({ username }) =>
      username?.includes(query.toLowerCase()),
    )
    return (
      <div className='flex w-full flex-col'>
        <InputBar
          placeholder='Search for user...'
          value={query}
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
          goBack={goBack}
        />

        <UserList users={filtered} onClick={callback} />
      </div>
    )
  }
}
