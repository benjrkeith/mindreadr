import { useQuery } from '@tanstack/react-query'
import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { getChats } from 'src/chats/api'
import { ChatPreview } from 'src/chats/components/ChatPreview'
import { useNavStore, useTitleBarStore } from 'src/store'

export function Chats() {
  const { setTitleBar } = useTitleBarStore()
  const nav = useNavStore()
  const navigate = useNavigate()

  useLayoutEffect(() => {
    nav.show()
    setTitleBar({
      title: 'Chats',
      backCallback: undefined,
      actionButton: {
        text: 'New Chat',
        callback: () => navigate('/chats/new'),
      },
    })
  }, [])

  const query = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  })

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError) return <div>{JSON.stringify(query.error)}</div>
  else if (query.data === undefined) return <div>404 Not Found</div>
  else
    return (
      <div className='[&>*:nth-child(even)]:bg-bg1 w-full overflow-scroll'>
        {query.data.map((chat) => (
          <ChatPreview key={chat.id} chat={chat} />
        ))}
      </div>
    )
}
