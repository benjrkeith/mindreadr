import { useQuery } from '@tanstack/react-query'
import { useState, type ReactElement } from 'react'

import { types } from 'src/common'
import { getAllUsernames } from 'src/common/api'
import { UserList } from 'src/common/components/UserList'
import { InputBar } from 'src/titleBar'

interface UserSearchProps {
  callback: (users: types.SelectableUser[]) => void
}

export function UserSearch({ callback }: UserSearchProps): ReactElement {
  const [query, setQuery] = useState<string>('')
  const [selected, setSelected] = useState<types.SelectableUser[]>([])

  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getAllUsernames })
  if (usersQuery.data === undefined) return <></>
  const data = usersQuery.data as types.SelectableUser[]

  const filtered = data.filter(({ username }) =>
    username?.includes(query.toLowerCase()),
  )

  const selectUser = (user: types.SelectableUser): void => {
    if (user.id === undefined) return

    if (user.selected) {
      setSelected(selected.filter(({ id }) => id !== user.id))
      user.selected = false
    } else {
      setSelected([...selected, user])
      user.selected = true
    }
  }

  return (
    <div className='flex w-full flex-col overflow-hidden bg-bg2'>
      <InputBar
        placeholder='Search for users...'
        query={query}
        setQuery={setQuery}
        submitCallback={() => {
          callback(selected)
        }}
      />

      <div className='flex flex-col overflow-hidden'>
        {filtered.length > 0 ? (
          <UserList users={filtered} onClick={selectUser} />
        ) : (
          <p
            className='mx-auto mt-2 w-4/6 rounded-xl bg-bg1 py-3 text-center
            text-lg font-medium'
          >
            No users found
          </p>
        )}
      </div>
    </div>
  )
}
