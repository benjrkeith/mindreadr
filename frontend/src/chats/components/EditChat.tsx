import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { editChat, EditChatDto, getChat } from 'src/chats/api'
import { useChatId } from 'src/chats/hooks'
import { UserList } from 'src/common/components/UserList'
import { useModalStore, useUserStore } from 'src/store'
import { useTitleBar } from 'src/titleBar'

const BUTTON_BASE_CLASS = 'rounded-xl bg-bg1 p-2 text-2xl font-medium'

export function EditChat() {
  const { user } = useUserStore()
  const { setModal } = useModalStore()
  const navigate = useNavigate()
  const chatId = useChatId()

  // get information such as chat name and member list
  const query = useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => getChat(chatId),
  })

  // edit query for updating name, adding users, and removing users
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (dto: EditChatDto) => editChat(chatId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId] })
      queryClient.invalidateQueries({ queryKey: ['chats'] })
    },
  })

  // set title bar to the chat name and back button to main chat page
  useTitleBar({
    title: query.data?.name || 'Chat',
    backCallback: () => navigate(`/chats/${chatId}`),
    actionButton: { text: '', callback: undefined },
  })

  // db provides chat_member objects, so we need to extract the user objects
  const users = useMemo(
    () => query.data?.members.map((member) => member.user),
    [query.data],
  )

  const onEditName = () => {
    const callback = (name: string | undefined) => {
      if (name === undefined || name === '') return

      setModal({ type: undefined })
      mutation.mutate({ name, addUsers: [], removeUsers: [] })
      navigate(`/chats/${chatId}`)
    }

    setModal({
      type: 'input',
      label: 'Enter new chat name:',
      callback,
    })
  }

  const onLeaveChat = () => {
    const callback = () => {
      setModal({ type: undefined })
      mutation.mutate({ addUsers: [], removeUsers: [user.id] })
      navigate('/chats')
    }

    setModal({
      type: 'confirm',
      label: 'Are you sure you want to leave?',
      callback,
    })
  }

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError || query.data === undefined)
    return <Navigate to='/chats' />
  else
    return (
      <div className='flex flex-col'>
        <div className='flex grow flex-col'>
          <UserList users={users ?? []} />
          <button
            className={`${BUTTON_BASE_CLASS} mx-auto px-6 text-3xl 
            text-green-800 hover:bg-fg1`}
          >
            <p className='filter-white text-2xl'>{'\u2795'}</p>
          </button>
        </div>
        <div className='m-2 grid grid-cols-2 gap-2'>
          <button
            className={`${BUTTON_BASE_CLASS} hover:bg-fg1`}
            onClick={onEditName}
          >
            Edit name
          </button>
          <button
            className={`${BUTTON_BASE_CLASS} hover:bg-red-500`}
            onClick={onLeaveChat}
          >
            Leave chat
          </button>
        </div>
      </div>
    )
}
