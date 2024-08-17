import { useNavigate, useParams } from 'react-router-dom'

export function useUserId() {
  // check id given in URL params is a number, otherwise redirect to /user
  const navigate = useNavigate()
  const params = useParams()
  const userId = parseInt(params.id as string)

  if (isNaN(userId)) navigate('/users')
  return userId
}
