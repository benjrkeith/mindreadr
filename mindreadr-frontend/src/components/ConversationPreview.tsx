import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

interface Props {
  i: number
  conversation: {
    conversation: number
    users: string[]
    avatar: string
    created_at: string
    content: string
    read: boolean
  }
}

export default function ConversationPreview (props: Props): ReactElement {
  const { conversation: conv, i } = props
  const user = useAuth()

  const getTitle = (users: string[]): string => {
    users.splice(users.indexOf(user.username), 1)
    return users.join(', ')
  }

  return (
    <Link key={i} className={`flex p-3 ${i % 2 === 0 ? 'bg-zinc-900' : ''}`}
        to={`/inbox/${conv.conversation}`}>
        <img src={conv.avatar} alt='avatar' className='h-16 rounded-full'/>
        <div className='w-full px-2 flex flex-col my-auto'>
            <div className='flex w-full'>
                <h1 className='text-xl font-semibold grow'>
                    {getTitle(conv.users)}
                </h1>
                {!conv.read && <h1 className='text-3xl leading-7 px-3 font-bold
                  text-purple-600'>•</h1>}
                <p className='text-xs my-auto'>
                    {new Date(conv.created_at).toLocaleString().substring(0, 17)}
                </p>
            </div>
            <p className='text-sm'>{conv.content}</p>
        </div>
    </Link>
  )
}
