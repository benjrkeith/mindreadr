import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { createMessage } from 'src/chats/api'
import { enter } from 'src/chats/assets'

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
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        className='bg-bg1 focus:outline-fg1 grow resize-none rounded-lg
        border-transparent p-2 text-white outline-none'
      />

      <button
        type='button'
        onClick={handleSubmit}
        className='bg-fg1 m-1 aspect-square rounded-lg'
      >
        <img src={enter} alt='send' className='filter-white mx-auto h-14' />
      </button>
    </div>
  )
}
