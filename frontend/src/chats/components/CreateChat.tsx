import { useMutation } from '@tanstack/react-query'
import { useLayoutEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { createChat } from 'src/chats/api'
import { types } from 'src/common'
import { UserList } from 'src/common/components/UserList'
import { UserSearch } from 'src/common/components/UserSeach'
import { useNavStore, useTitleBarStore } from 'src/store'
import { InputBar } from 'src/titleBar'

type CreateChatDto = {
  name: string
  users: number[]
}

export function CreateChat() {
  const [users, setUsers] = useState<types.SelectableUser[]>([])
  const [name, setName] = useState('')

  const { setTitleBar } = useTitleBarStore()
  const nav = useNavStore()
  const navigate = useNavigate()

  // mutation for creating post request for new chat
  // after creating new chat, navigate to chat page
  const mutation = useMutation({
    mutationFn: (chat: CreateChatDto) => createChat(chat.name, chat.users),
    onSuccess: (data) => {
      navigate(`/chats/${data.id}`)
    },
  })

  // setup title bar
  useLayoutEffect(() => {
    nav.hide()
    setTitleBar({
      title: '',
      backCallback: () => navigate('/chats'),
      actionButton: { text: '', callback: undefined },
    })
  }, [])

  const selectUsers = (users: types.SelectableUser[]) => setUsers(users)

  // once users and name are set, create a new chat
  const onSubmit = async () => {
    const newChat = { name, users: users.map(({ id }) => id) }
    mutation.mutate(newChat)
  }

  return (
    <div className='w-full'>
      {users.length === 0 ? (
        <UserSearch callback={selectUsers} />
      ) : (
        <>
          <InputBar
            query={name}
            setQuery={setName}
            placeholder='Name your chat...'
            submitCallback={onSubmit}
          />
          <UserList users={users} onClick={() => {}} />
        </>
      )}
    </div>
  )
}
