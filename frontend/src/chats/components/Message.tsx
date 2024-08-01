import { Link } from 'react-router-dom'

import { useAuth } from 'src/auth'
import { translateSystemMessage } from 'src/chats/methods'
import { types } from 'src/common'

export function Message({ msg }: { msg: types.Message }) {
  const { user } = useAuth()

  const formatMessage = () => {
    // system message, renders in center
    if (msg.system) {
      const content = translateSystemMessage(msg)
      return (
        <p
          className='mx-auto rounded-md bg-dark_bg_1dp px-2 py-1 text-xs 
          font-medium'
        >
          {content}
        </p>
      )
    }
    // users own message, renders on right side in purple
    else if (msg.author.id === user.id)
      return (
        <div
          className='ml-auto flex max-w-[95%] gap-2 rounded-xl rounded-br-none 
          bg-primary_base bg-opacity-40 p-2'
        >
          <div className='flex flex-col'>
            <h1 className='w-full text-end text-xl font-medium leading-6'>
              You
            </h1>
            <p className='w-full text-end text-xs'>{msg.content}</p>
          </div>
          <Link
            className='aspect-square size-10'
            to={`/users/${msg.author.username}`}
          >
            <img
              src={msg.author.avatar}
              alt={msg.author.username}
              className='size-10 rounded-full object-cover'
            />
          </Link>
        </div>
      )
    // other users message, renders on left side in dark grey
    else
      return (
        <div
          className='mr-auto flex max-w-[95%] gap-2 rounded-xl rounded-bl-none 
        bg-dark_bg_1dp p-2'
        >
          <Link
            className='aspect-square size-10'
            to={`/users/${msg.author.username}`}
          >
            <img
              src={msg.author.avatar}
              alt='avatar'
              className='size-10 rounded-full object-cover'
            />
          </Link>
          <div className='flex flex-col'>
            <h1 className='w-full text-xl font-medium leading-6'>
              {msg.author.username}
            </h1>
            <p className='w-full text-xs'>{msg.content}</p>
          </div>
        </div>
      )
  }

  return <div className='flex w-full p-[0.4rem]'>{formatMessage()}</div>
}
