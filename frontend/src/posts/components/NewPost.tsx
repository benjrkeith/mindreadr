import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/common'

import { createPost } from 'src/posts/api'
import { Editor } from 'src/posts/components/Editor'
import { TitleBar } from 'src/titleBar'

export function NewPost() {
  const [content, setContent] = useState('')

  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      navigate('/posts')
    },
  })

  return (
    <div className='flex grow flex-col'>
      <TitleBar title='New Post' goBack={() => navigate('/posts')} />
      <Editor
        sx='p-2'
        placeholder='Share your thoughts...'
        content={content}
        setContent={setContent}
      />
      <Button
        value='Submit'
        sx='mx-auto my-4'
        onClick={() => mutation.mutate(content)}
      />
    </div>
  )
}
