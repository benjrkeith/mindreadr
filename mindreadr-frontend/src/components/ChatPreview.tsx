import React, { type ReactElement } from 'react'

import useAuth from '../hooks/useAuth'
import { type Chat } from '../api/common'

interface Props {
  i: number
  chat: Chat
}

export default function ChatPreview ({ i, chat }: Props): ReactElement {
  const user = useAuth()
  const date = new Date(chat.lastMsg.createdAt)

  const getTitle = (users: string[]): string => {
    const self = users.indexOf(user.username)
    users.splice(self, 1)
    return users.join(', ')
  }

  return (
    <button key={i} className={`flex p-3 ${i % 2 === 0 && 'bg-zinc-900'}`}
        onClick={() => { console.log('open convo') }}>
      <img src={chat.lastMsg.author.avatar} alt='avatar' className='h-16 rounded-full'/>
      <div className='w-full px-3 flex flex-col my-auto'>
        <div className='flex w-full'>
          <h1 className='text-xl font-semibold grow text-left'>
              {getTitle(chat.users)}
          </h1>

          {!chat.read &&
            <h1 className='text-3xl leading-7 px-3 font-bold text-purple-600'>
              •
            </h1>
          }

          <p className='text-xs my-auto'>
              {date.toLocaleString().substring(0, 17)}
          </p>
        </div>
        <p className='text-sm text-left'>
          {chat.lastMsg.content}
        </p>
      </div>
    </button>
  )
}
