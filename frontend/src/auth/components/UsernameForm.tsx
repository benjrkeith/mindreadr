import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { debounce } from 'lodash'
import { useCallback, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { checkUsername as _checkUsername } from 'src/auth/api'
import { Input } from 'src/auth/components/Input'
import { usernameSchema } from 'src/auth/schemas'
import { Button } from 'src/common'

interface UsernameFormProps {
  text: string
  isActive: boolean
  isLogin?: boolean
  setUsername: (username: string) => void
}

export function UsernameForm(props: UsernameFormProps) {
  const { text, isActive, isLogin, setUsername } = props

  // pass own ref to the input so that we can control the focus
  const ref = useRef<HTMLInputElement>(null)

  // create a form with react-hook-form
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    mode: 'onChange',
  })

  // watch for changes in username field for use in checkUsername query
  const usernameValue = watch('username')

  // check if the username is already taken
  const onSubmit = handleSubmit(async () => {
    const isTaken = await refetch()
    if (!isTaken) setUsername(usernameValue)
  })

  // check if the username is taken as the user is typing
  // debocunce the function so that it doesn't query on every key press
  const checkUsername = useCallback(
    debounce(async (username: string) => {
      if (!username) return
      await refetch()
    }, 500),
    [],
  )
  useEffect(() => void checkUsername(usernameValue), [usernameValue])

  // query for checking if a username is already taken
  // enabled is false as otherwise it will query every time you type a letter
  const query = useQuery({
    queryKey: ['username', usernameValue],
    queryFn: () => _checkUsername(usernameValue),
    enabled: false,
  })

  // returns true if the username if error
  const refetch = async () => {
    const { data } = await query.refetch()
    const isTaken = data?.data

    if (isTaken && !isLogin) {
      setError('username', { message: 'Username is already taken' })
      return true
    }

    if (!isTaken && isLogin) {
      setError('username', { message: 'Username is not registered' })
      return true
    }
  }

  // focus the input when this step is put into view
  // without delay the transition bugs out
  useEffect(() => {
    if (isActive) setTimeout(() => ref.current?.focus(), 100)
  }, [isActive])

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className='mb-4 flex w-full flex-col items-center gap-2'
    >
      <h1 className='mb-4 text-base'>{text}</h1>
      <Input
        _ref={ref}
        tabIndex={isActive ? 0 : -1}
        label='Username'
        register={register}
        error={errors.username}
      />
      <Button
        tabIndex={isActive ? 0 : -1}
        type='submit'
        value='Next'
        disabled={!isDirty || !isValid}
      />
    </form>
  )
}
