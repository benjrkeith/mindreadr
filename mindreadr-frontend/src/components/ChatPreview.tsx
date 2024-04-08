import React, { type ReactElement } from 'react'

import useAuth from '../hooks/useAuth'

import { type ChatMeta } from '../api/common'

interface Props {
  i: number
  chat: ChatMeta
  openChat: () => void
}

export default function ChatPreview ({ i, chat, openChat }: Props): ReactElement {
  const user = useAuth()
  const date = new Date(chat.lastMsg.createdAt)

  const getTitle = (users: string[]): string => {
    const self = users.indexOf(user.username)
    if (self === -1) return users.join(', ')

    users.splice(self, 1)
    return users.join(', ')
  }

  return (
    <button key={i} className={`flex p-3 w-full ${i % 2 === 0 && 'bg-zinc-900'}`}
        onClick={openChat}>
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
