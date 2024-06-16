import { useNavigate, useParams } from 'react-router-dom'

export function useChatId() {
  // check id given in URL params is a number, otherwise redirect to /chats
  const navigate = useNavigate()
  const params = useParams()
  const chatId = parseInt(params.id as string)

  if (isNaN(chatId)) navigate('/chats')
  return chatId
}
