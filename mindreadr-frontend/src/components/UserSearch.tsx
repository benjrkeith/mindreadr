import React, {
  type ReactElement,
  useCallback, useEffect, useState
} from 'react'

import { getAllUsernames, type UserPreview } from '../api/getAllUsernames'

interface Props {
  hide: () => void
  callback: (users: string[]) => void
}

export default function UserSearch ({ hide, callback }: Props): ReactElement {
  const [users, setUsers] = useState<UserPreview[]>([])
  const [query, setQuery] = useState<string>('')
  const [selection, setSelection] = useState<number>(0)
  const [selected, setSelected] = useState<string[]>([])

  const getUsers = useCallback(async () => {
    setUsers(await getAllUsernames())
  }, [setUsers, getAllUsernames])

  useEffect(() => { void getUsers() }, [getUsers])

  const filtered = users.filter((u) => u.username.includes(query.toLowerCase())).slice(0, 6)

  function handleKeyDown (e: React.KeyboardEvent): void {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const newI = selection + 1
      if (newI >= filtered.length) return
      setSelection(newI)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const newI = selection - 1
      if (newI < 0) return
      setSelection(newI)
    }

    if (e.key === 'Enter') {
      e.preventDefault()
      selectUser(filtered[selection].username)
    }
  }

  const selectUser = (username: string): void => {
    if (selected.includes(username)) setSelected(selected.filter((u) => u !== username))
    else setSelected([...selected, username])
  }

  return (
    <div className='fixed top-0 z-20 w-full flex flex-col bg-grey'>
        <div className='flex'>
            <button onClick={hide} className='font-semibold text-4xl my-auto px-3
               text-purple-600'>&#8592;</button>
            <input type='text' value={query} autoFocus onKeyDown={handleKeyDown}
              className='text-black h-12 w-full text-start outline-none px-3'
              onChange={(e) => {
                setQuery(e.target.value)
                setSelection(0)
              }}/>
        </div>
        <div className='flex flex-col'>
            {filtered.map((user, i) =>
              <button key={i} onClick={() => { selectUser(user.username) }}
                className={`flex gap-3 px-5 py-[0.4rem] ${i % 2 === 0 && 'bg-zinc-900'}`}>
                  <img src={user.avatar} alt='avatar' className='h-10 rounded-full'/>
                  <h1 className={`my-auto text-lg font-medium 
                    ${i === selection && 'text-purple-600'}`}>{user.username}</h1>
                  {selected.includes(user.username) && <p className='text-green-600
                    w-full text-end text-3xl my-auto'>&#10003;</p>}
              </button>)
            }
            {filtered.length === 0 &&
              <p className='text-center text-xl text-white p-2 font-semibold'>
                No users found
              </p>
            }
            {filtered.length > 0 && selected.length > 0 &&
              <button type='submit' className='text-center text-xl text-white
                p-2 font-semibold' onClick={() => {
                hide()
                callback(selected)
              }}>Create Chat</button>}
        </div>
    </div>
  )
}
