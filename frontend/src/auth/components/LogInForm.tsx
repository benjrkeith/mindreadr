import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { LogInDto, logIn } from 'src/auth/api'
import { Input } from 'src/auth/components/Input'
import { useAuth } from 'src/auth/hooks'
import { loginSchema } from 'src/auth/schemas/login'
import { cacheUser } from 'src/auth/services'
import { Button } from 'src/common'

export function LogInForm() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  // create a form with react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    setError,
  } = useForm<LogInDto>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  })

  // mutation for posting login credentials
  const mutation = useMutation({
    mutationFn: logIn,
    onSuccess: (user) => {
      cacheUser(user)
      setUser(user)
      navigate('/')
    },
    onError: (err: AxiosError) => {
      const status = err.response?.status
      if (status === 404)
        setError('username', { message: 'User could not be found' })
      else if (status === 401)
        setError('password', { message: 'Password is incorrect' })
    },
  })

  return (
    <form
      noValidate
      onSubmit={handleSubmit((dto) => mutation.mutate(dto))}
      className='flex grow-[2] flex-col items-center justify-center gap-2'
    >
      <Input
        autoFocus
        label='Username'
        register={register}
        error={errors.username}
      />
      <Input
        type='password'
        label='Password'
        register={register}
        error={errors.password}
      />

      <div />
      <Button
        type='submit'
        value='Log In'
        disabled={!isDirty || !isValid || mutation.isPending}
      />
    </form>
  )
}
