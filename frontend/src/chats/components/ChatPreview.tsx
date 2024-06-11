import { Link } from 'react-router-dom'

import { translateSystemMessage } from 'src/chats/methods'
import { types } from 'src/common'
import { useUserStore } from 'src/store'

interface ChatPreviewProps {
  chat: types.Chat
}

export function ChatPreview({ chat }: ChatPreviewProps) {
  if (chat === undefined) return <></>
  const { user } = useUserStore()

  const lastMsg = chat.messages[chat.messages.length - 1]
  const avatar = lastMsg.author.avatar
  const date = new Date(lastMsg.createdAt)

  if (lastMsg.system) lastMsg.content = translateSystemMessage(lastMsg)

  const myMember = chat.members.find((member) => member.user.id === user.id)
  const isRead = myMember?.isRead || false

  return (
    <Link
      className='flex w-full grow gap-4 border-solid px-4 py-3'
      to={`/chats/${chat.id}`}
    >
      <img
        src={avatar}
        alt='avatar'
        className='aspect-square h-[4.5rem] rounded-full object-cover'
      />
      <div className='my-auto flex w-full flex-col gap-1'>
        <div className='flex w-full gap-4'>
          <h1 className='truncate text-left text-2xl font-semibold'>
            {chat.name}
          </h1>

          {!isRead && (
            <h1 className='text-fg1 my-auto text-3xl font-bold leading-3'>•</h1>
          )}

          <p className='my-auto grow truncate text-end text-xs'>
            {date.toLocaleString().substring(0, 17)}
          </p>
        </div>

        <p className='text-left text-sm'>{lastMsg.content}</p>
      </div>
    </Link>
  )
}
