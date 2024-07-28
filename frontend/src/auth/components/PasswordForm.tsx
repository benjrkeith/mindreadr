import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from 'src/auth/components/Button'
import { Input } from 'src/auth/components/Input'
import { passwordSchema } from 'src/auth/schemas'

interface PasswordFormProps {
  isActive: boolean
  setPassword: (password: string) => void
}

export function PasswordForm(props: PasswordFormProps) {
  const { isActive, setPassword } = props

  // create own ref for the input so that we can control the focus
  const ref = useRef<HTMLInputElement>(null)

  // create a form with react-hook-form
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isValid },
  } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
  })

  // submit callback wrapped in react-hook-form's handleSubmit
  const onSubmit = handleSubmit((dto: z.infer<typeof passwordSchema>) => {
    if (dto.password !== dto.confirm)
      setError('confirm', { message: 'Password does not match' })
    else setPassword(dto.password)
  })

  // focus the input when this step is put into view
  // without delay the transition bugs out
  useEffect(() => {
    if (isActive) setTimeout(() => ref.current?.focus(), 100)
  }, [isActive])

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className='flex w-full flex-col items-center gap-2'
    >
      <Input
        _ref={ref}
        tabIndex={isActive ? 0 : -1}
        type='password'
        label='Password'
        register={register}
        error={errors.password}
      />
      <Input
        tabIndex={isActive ? 0 : -1}
        type='password'
        label='Confirm'
        register={register}
        error={errors.confirm}
      />
      <div />
      <Button type='submit' value='Submit' disabled={!isDirty || !isValid} />
    </form>
  )
}
