import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'

import { createMessage } from 'src/chats/api'

import sendImg from 'src/chats/assets/send.png'

interface NewMessageProps {
  chatId: number
}

export function NewMessage({ chatId }: NewMessageProps) {
  const ref = useRef<HTMLDivElement>(null)

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chats', chatId, 'messages'] })
    },
  })

  // Allow enter to be used to send the message
  // Do not allow new lines in the message
  const handleKeyDown = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await handleSubmit()
    }
  }

  // Validate and send new chat message
  const handleSubmit = async () => {
    const div = ref.current
    if (div?.innerText === undefined || div?.innerText === '') return

    mutation.mutate({ chatId, content: div.innerText })
    div.innerText = ''
  }

  // Using content editable div so the text box automatically grows in height
  return (
    <div
      className='flex gap-2 bg-dark_bg_1dp p-2 shadow-[0px_-10px_6px] 
      shadow-black/20'
    >
      <div
        ref={ref}
        contentEditable
        onKeyDown={handleKeyDown}
        className='grow overflow-x-hidden break-words rounded-lg 
        bg-dark_bg_base px-2 py-1 outline outline-1 outline-transparent
        hover:outline-white focus:outline-primary_base'
      />
      <button
        type='button'
        onClick={handleSubmit}
        className='bg-fg1 mt-auto aspect-square size-8 rounded-lg 
        bg-primary_base bg-opacity-70 text-5xl font-semibold 
        hover:bg-opacity-100'
      >
        <img
          src={sendImg}
          alt='send'
          className='mx-auto size-8 p-1 opacity-90 invert hover:opacity-100'
        />
      </button>
    </div>
  )
}
