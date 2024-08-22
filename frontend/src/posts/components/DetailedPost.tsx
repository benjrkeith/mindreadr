import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Navigate, useNavigate } from 'react-router-dom'

import { useState } from 'react'
import { createComment, getPost } from 'src/posts/api'
import { Comment } from 'src/posts/components/Comment'
import { Editor } from 'src/posts/components/Editor'
import { Post } from 'src/posts/components/Post'
import { usePostId } from 'src/posts/hooks'
import { TitleBar } from 'src/titleBar'

export function DetailedPost() {
  const id = usePostId()
  const navigate = useNavigate()

  const [content, setContent] = useState('')

  const query = useQuery({
    queryKey: ['posts', id],
    queryFn: () => getPost(id),
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: () => createComment(id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', id] })
      setContent('')
    },
  })

  if (query.isLoading || query.isLoading) return <div>Loading...</div>
  else if (query.isError || query.data === undefined)
    return <Navigate to='/chats' />
  else
    return (
      <div className='flex grow flex-col overflow-hidden'>
        <TitleBar title='Comments' goBack={() => navigate('/posts')} />
        <Post data={query.data} sx='mb-0 rounded-b-none' />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            mutation.mutate()
          }}
          className='mx-2 flex rounded-b-lg border-t-2 border-dark_bg_base 
          bg-dark_bg_1dp'
        >
          <Editor
            content={content}
            setContent={setContent}
            placeholder={`Reply...`}
            sx='p-2 grow text-sm'
          />
          <button
            type='submit'
            className='mt-auto px-3 text-3xl text-primary_base'
          >
            🡲
          </button>
        </form>

        <div
          className='m-2 flex flex-col divide-y-2 divide-dark_bg_base 
          overflow-scroll rounded-lg bg-dark_bg_1dp'
        >
          {query.data.comments.map((comment) => (
            <Comment key={comment.id} data={comment} />
          ))}
        </div>
      </div>
    )
}
