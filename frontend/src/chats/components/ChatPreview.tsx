import { Link } from 'react-router-dom'

import { useAuth } from 'src/auth'
import { translateSystemMessage } from 'src/chats/methods'
import { Avatar, types } from 'src/common'

// If the date is today, return the time, otherwise return the date
function getDateString(date: Date) {
  if (date.getDate() === new Date().getDate())
    return date.toLocaleTimeString().slice(0, 5)
  else return date.toLocaleDateString()
}

interface ChatPreviewProps {
  chat: types.Chat
}

export function ChatPreview({ chat }: ChatPreviewProps) {
  const { user } = useAuth()
  const otherUser = chat.members.find(
    (member) => member.user.id !== user.id,
  )?.user

  // Translate last message info for use in preview
  const lastMsg = chat.messages[chat.messages.length - 1]
  const lastMsgDate = new Date(lastMsg.createdAt)
  if (lastMsg.system) lastMsg.content = translateSystemMessage(lastMsg)

  // Finds the current users 'member' object in the chats members array
  // Use this to determine if we should show unread messages indicator
  const myMember = chat.members.find((member) => member.user.id === user.id)
  const isRead = myMember?.isRead || false

  if (!otherUser) return <></>
  return (
    <Link
      className='flex w-full gap-3 px-3 py-2 hover:bg-dark_bg_1dp'
      to={`/chats/${chat.id}`}
    >
      <div className='my-auto flex aspect-square size-12'>
        <Avatar user={otherUser} sx='rounded-full w-full' />
      </div>
      <div className='my-auto flex w-full flex-col overflow-hidden'>
        <div className='flex w-full gap-4'>
          <h1 className='truncate text-left text-lg font-semibold'>
            {chat.name}
          </h1>

          {!isRead && (
            <h1 className='my-auto text-lg font-bold leading-3 text-primary_base'>
              •
            </h1>
          )}

          <p className='my-auto grow truncate text-end text-[0.6rem]'>
            {getDateString(lastMsgDate)}
          </p>
        </div>

        <p className='truncate text-left text-[0.7rem]'>{lastMsg.content}</p>
      </div>
    </Link>
  )
}
