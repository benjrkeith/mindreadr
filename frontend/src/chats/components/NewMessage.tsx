import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { createMessage } from 'src/chats/api'

interface NewMessageProps {
  chatId: number
}

interface NewMessageDto {
  chatId: number
  text: string
}

export function NewMessage({ chatId }: NewMessageProps) {
  const [text, setText] = useState('')

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (dto: NewMessageDto) => createMessage(dto.chatId, dto.text),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'messages'] })
    },
  })

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (text === '') return
    mutation.mutate({ chatId, text })
    setText('')
  }

  return (
    <div className='z-10 mx-2 my-2 flex gap-2'>
      <textarea
        rows={2}
        value={text}
        autoFocus
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className='grow resize-none rounded-lg border-transparent bg-bg1 p-2 
        text-white outline-none focus:outline-fg1'
      />

      <button
        type='button'
        onClick={handleSubmit}
        className='text-fg0 hover:bg-fg3 m-1 aspect-square
         rounded-lg bg-fg1 text-5xl font-semibold'
      >
        {'\u21B5'}
      </button>
    </div>
  )
}
// hover:bg-fg1 hover:text-fg2
