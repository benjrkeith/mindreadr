import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useLayoutEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { getChat, getMessages } from 'src/chats/api'
import { NewMessage } from 'src/chats/components/NewMessage'
import { useChatId } from 'src/chats/hooks'
import { InfiniteScroll } from 'src/common'
import { useNavStore } from 'src/store'
import { useTitleBar } from 'src/titleBar'

export function Chat() {
  const chatId = useChatId()
  const navigate = useNavigate()

  // use nav store to hide the nav bar
  const nav = useNavStore()
  useLayoutEffect(nav.hide, [])

  // standard query for getting chat meta data
  const chatQuery = useQuery({
    queryKey: ['chats', chatId],
    queryFn: () => getChat(chatId),
  })

  // set title bar to the chat name
  useTitleBar(
    {
      title: chatQuery.data?.name || 'Chat',
      backCallback: () => navigate('/chats'),
      actionButton: {
        text: '\u22EE',
        callback: () => navigate(`/chats/${chatId}/edit`),
      },
    },
    [chatQuery.data],
  )

  // infinite query for getting all messages in the chat
  const infQuery = useInfiniteQuery({
    queryKey: ['chats', chatId, 'messages'],
    queryFn: ({ pageParam }) => getMessages(chatId, pageParam, 12),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === 0 ? undefined : lastPageParam + 12,
    select: (data) => ({
      pages: [...data.pages].reverse(),
    }),
  })

  // when getting messages, invalidate the chats query to update is read status
  const queryClient = useQueryClient()
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['chats'] })
  }, [])

  // infinite query states
  if (infQuery.isLoading) return <div>Loading...</div>
  else if (infQuery.isError || infQuery.data === undefined)
    return <Navigate to='/chats' />
  else
    return (
      <div className='mt-auto flex h-full w-full flex-col'>
        <InfiniteScroll infQuery={infQuery} />
        <NewMessage chatId={chatId} />
      </div>
    )
}
