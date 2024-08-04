import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { createChat, CreateChatDto } from 'src/chats/api'
import { UserSearch } from 'src/common'

export function NewChat() {
  const navigate = useNavigate()

  // post request for creating new chat, on success navigate to chat page
  const mutation = useMutation({
    mutationFn: (dto: CreateChatDto) => createChat(dto),
    onSuccess: (data) => navigate(`/chats/${data.id}`),
  })

  return (
    <UserSearch
      callback={(user) => mutation.mutate({ user })}
      goBack={() => navigate('/chats')}
    />
  )
}
