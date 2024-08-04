import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { getChat, getMessages } from 'src/chats/api'
import { NewMessage } from 'src/chats/components/NewMessage'
import { useChatId } from 'src/chats/hooks'
import { InfiniteScroll } from 'src/common'
import { TitleBar } from 'src/titleBar'

export function Chat() {
  const navigate = useNavigate()
  const id = useChatId()

  // standard query for getting chat meta data
  const chatQuery = useQuery({
    queryKey: ['chats', id],
    queryFn: () => getChat(id),
  })

  // infinite query for getting all messages in the chat
  const msgQuery = useInfiniteQuery({
    queryKey: ['chats', id, 'messages'],
    queryFn: ({ pageParam }) => getMessages(id, pageParam, 8),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length !== 8 ? undefined : lastPageParam + 8,
    select: (data) => ({
      pages: [...data.pages].reverse(),
    }),
  })

  // when opening a chat, invalidate the chats query to update its read status
  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['chats'] })
  }, [])

  if (msgQuery.isLoading || chatQuery.isLoading) return <div>Loading...</div>
  else if (
    msgQuery.isError ||
    msgQuery.data === undefined ||
    chatQuery.isError ||
    chatQuery.data === undefined
  )
    return <Navigate to='/chats' />
  else
    return (
      <div className='flex grow flex-col overflow-hidden'>
        <TitleBar
          title={chatQuery.data?.name || 'Chat'}
          goBack={() => navigate('/chats')}
          // actions={[
          //   { text: 'Edit Name', callback: () => {} },
          //   { text: 'Manage Users', callback: () => {} },
          //   { text: 'Delete Chat', callback: () => {} },
          // ]}
        />
        <InfiniteScroll infQuery={msgQuery} />
        <NewMessage chatId={chatQuery.data.id} />
      </div>
    )
}
