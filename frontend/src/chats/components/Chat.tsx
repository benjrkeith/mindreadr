import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'

import { getChat, getMessages } from 'src/chats/api'
import { EditChat } from 'src/chats/components/EditChat'
import { NewMessage } from 'src/chats/components/NewMessage'
import { InfiniteScroll } from 'src/common'
import { useNavStore, useTitleBarStore } from 'src/store'

export function Chat() {
  // check id given in URL params is a number, otherwise redirect to /chats
  const params = useParams()
  const chatId = parseInt(params.id as string)
  if (isNaN(chatId)) return <Navigate to='/chats' />

  const [showMenu, setShowMenu] = useState(false)
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
  const { setTitleBar } = useTitleBarStore()
  useLayoutEffect(() => {
    setTitleBar({
      title: chatQuery.data?.name || 'Chat',
      backCallback: () => navigate('/chats'),
      actionButton: { text: '\u22EE', callback: () => setShowMenu(true) },
    })
  }, [chatQuery.data])

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
  else if (infQuery.isError) return <div>{JSON.stringify(infQuery.error)}</div>
  else if (infQuery.data === undefined) return <div>404 Not Found</div>
  else
    return (
      <div className='mt-auto flex h-full w-full flex-col'>
        {showMenu ? (
          <EditChat backCallback={() => setShowMenu(false)} />
        ) : (
          <>
            <InfiniteScroll infQuery={infQuery} />
            <NewMessage chatId={chatId} />
          </>
        )}
      </div>
    )
}
