import { Link } from 'react-router-dom'
import { types } from 'src/common'
import { useUserStore } from 'src/store'
import { translateSystemMessage } from '../methods'

export function Message({ msg }: { msg: types.Message }) {
  const { user } = useUserStore()

  const formatMessage = () => {
    // system message, renders in center
    if (msg.system) {
      const content = translateSystemMessage(msg)
      return (
        <p className='mx-auto rounded-xl bg-bg1 px-8 py-2 font-semibold'>
          {content}
        </p>
      )
    }
    // users own message, renders on right side in purple
    else if (msg.author.id === user.id)
      return (
        <div
          className='ml-auto flex max-w-[95%] gap-3 rounded-xl rounded-br-none 
          bg-fg1 px-3 py-2'
        >
          <div className='flex flex-col'>
            <h1 className='w-full text-end text-2xl font-medium'>You</h1>
            <p className='w-full text-end text-sm'>{msg.content}</p>
          </div>
          <Link
            className='aspect-square size-[3.2rem]'
            to={`/users/${msg.author.username}`}
          >
            <img
              src={msg.author.avatar}
              alt='avatar'
              className='mb-auto size-[3.2rem] rounded-full object-cover'
            />
          </Link>
        </div>
      )
    // other users message, renders on left side in dark grey
    else
      return (
        <div
          className='mr-auto flex max-w-[95%] gap-3 rounded-xl rounded-bl-none 
        bg-bg1 px-3 py-2'
        >
          <Link
            className='aspect-square size-[3.2rem]'
            to={`/users/${msg.author.username}`}
          >
            <img
              src={msg.author.avatar}
              alt='avatar'
              className='mb-auto size-[3.2rem] rounded-full object-cover'
            />
          </Link>
          <div className='flex flex-col'>
            <h1 className='w-full text-2xl font-medium'>
              {msg.author.username}
            </h1>
            <p className='w-full text-sm'>{msg.content}</p>
          </div>
        </div>
      )
  }

  return <div className='flex w-full p-2 px-4'>{formatMessage()}</div>
}
