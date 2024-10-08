import { Link } from 'react-router-dom'

import { useAuth } from 'src/auth'
import { translateSystemMessage } from 'src/chats/methods'
import { Avatar, types } from 'src/common'

export function Message({ data }: { data: types.Message }) {
  const { user } = useAuth()

  const formatMessage = () => {
    // system message, renders in center
    if (data.system) {
      const content = translateSystemMessage(data)
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
    else if (data.author.id === user.id)
      return (
        <div
          className='ml-auto flex max-w-[95%] gap-2 rounded-xl rounded-br-none 
          bg-primary_base bg-opacity-50 p-2'
        >
          <div className='flex flex-col'>
            <h1 className='w-full text-end text-xl font-medium leading-6'>
              You
            </h1>
            <p className='w-full text-end text-xs'>{data.content}</p>
          </div>
          <Link
            className='aspect-square size-10'
            to={`/users/${data.author.username}`}
          >
            <Avatar user={data.author} sx='size-10 rounded-full' />
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
            to={`/users/${data.author.username}`}
          >
            <Avatar user={data.author} sx='size-10 rounded-full' />
          </Link>
          <div className='flex flex-col'>
            <h1 className='w-full text-xl font-medium leading-6'>
              {data.author.username}
            </h1>
            <p className='w-full text-xs'>{data.content}</p>
          </div>
        </div>
      )
  }

  return <div className='flex w-full p-[0.4rem]'>{formatMessage()}</div>
}
