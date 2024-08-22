import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent } from 'react'
import { useParams } from 'react-router-dom'

import { uploadAvatar } from 'src/users/api'
import { pencil } from 'src/users/assets'

export function UploadAvatar() {
  const { username } = useParams() as { username: string }

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      // Adding a query param to the avatar URL will force the browser to
      // ignore cache and get the new image straight away
      queryClient.setQueryData(['users', username], (data: any) => ({
        ...data,
        avatar: data.avatar + '?t=' + new Date().getTime(),
      }))
    },
  })

  const handleInput = (e: FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement
    if (input.files === null) return
    mutation.mutate(input.files[0])
  }

  return (
    <div className='col-[1/1] row-[1/1] w-full'>
      <label
        className='m-2 ml-auto block w-fit rounded-lg bg-dark_bg_base 
        opacity-70 hover:opacity-95'
      >
        <input
          type='file'
          onInput={handleInput}
          className='hidden w-full p-2'
        />
        <img src={pencil} className='size-10 p-2 invert' />
      </label>
    </div>
  )
}
