import { useQuery } from '@tanstack/react-query'

import { useNavigate } from 'react-router-dom'
import { getChats } from 'src/chats/api'
import { ChatPreview } from 'src/chats/components/ChatPreview'
import { TitleBar } from 'src/titleBar'

export function Chats() {
  const navigate = useNavigate()

  const query = useQuery({
    queryKey: ['chats'],
    queryFn: () => getChats(),
  })

  if (query.isLoading) return <div>Loading...</div>
  else if (query.isError) return <div>{JSON.stringify(query.error)}</div>
  else if (query.data === undefined) return <div>404 Not Found</div>
  else
    return (
      <div className='w-full grow overflow-scroll'>
        <TitleBar
          title='Chats'
          actions={[{ text: 'New Chat', callback: () => navigate('new') }]}
        />
        <div className='flex flex-col divide-y-2 divide-dark_bg_1dp'>
          {query.data.map((chat) => (
            <ChatPreview key={chat.id} chat={chat} />
          ))}
          {query.data.length === 0 && (
            <div className='p-3 text-center font-medium'>No chats found.</div>
          )}
        </div>
      </div>
    )
}
