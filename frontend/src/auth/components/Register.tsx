import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { register as registerFn } from 'src/auth/api'
import { Footer } from 'src/auth/components/Footer'
import { Logo } from 'src/auth/components/Logo'
import { PasswordForm } from 'src/auth/components/PasswordForm'
import { UsernameForm } from 'src/auth/components/UsernameForm'
import { useAuth } from 'src/auth/hooks'
import { cacheUser } from 'src/auth/services'
import { Stepper } from 'src/stepper'

export function Register() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [username, _setUsername] = useState('')

  // create mutation for posting register credentials
  const mutation = useMutation({
    mutationFn: registerFn,
    onSuccess: (user) => {
      cacheUser(user)
      setUser(user)
      navigate('/')
    },
  })

  const setUsername = (username: string) => {
    _setUsername(username)
    setStep((prev) => prev + 1)
  }

  const setPassword = (password: string) =>
    mutation.mutate({ username, password })

  const _setStep = (step: number) => {
    if (username !== '') setStep(step)
  }

  return (
    <div className='my-auto flex min-h-[568px] min-w-[320px] flex-col'>
      <Logo />
      <Stepper current={step} setCurrent={_setStep} disableNav>
        <UsernameForm
          text="Hi. What's your name?"
          setUsername={setUsername}
          isActive={step === 0}
        />
        <PasswordForm setPassword={setPassword} isActive={step === 1} />
      </Stepper>
      <Footer
        text='Already have an account?'
        link={{ text: 'Log In', to: '/auth/login' }}
      />
    </div>
  )
}
