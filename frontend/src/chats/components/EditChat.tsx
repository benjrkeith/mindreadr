import { useNavigate } from 'react-router-dom'
import { useTitleBar } from 'src/common'
import { useChatId } from '../hooks'

export function EditChatButton({ text }: { text: string }) {
  return (
    <button type='button' className='m-2 rounded-xl p-2 text-2xl'>
      {text}
    </button>
  )
}

export function EditChat() {
  const navigate = useNavigate()
  const chatId = useChatId()

  useTitleBar({
    backCallback: () => navigate(`/chats/${chatId}`),
    actionButton: { text: '', callback: undefined },
  })

  return <>Chat Name</>
}
