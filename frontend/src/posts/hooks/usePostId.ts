import { useNavigate, useParams } from 'react-router-dom'

export function usePostId() {
  // check id given in URL params is a number, otherwise redirect to /posts
  const navigate = useNavigate()
  const params = useParams()
  const postId = parseInt(params.id as string)

  if (isNaN(postId)) navigate('/posts')
  return postId
}
