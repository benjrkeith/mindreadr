import { AxiosError } from 'axios'
import { useState, type FormEvent, type ReactElement } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { logIn, register } from 'src/auth/api'
import { AuthFooter } from 'src/auth/components/AuthFooter'
import { AuthHeader } from 'src/auth/components/AuthHeader'
import { AuthInput } from 'src/auth/components/AuthInput'
import { cacheUser } from 'src/auth/services'
import { useNavStore, useUserStore } from 'src/store'

export function Auth(): ReactElement {
  const [creds, setCreds] = useState({ username: '', password: '' })
  const [error, setError] = useState('\u200B')

  const loc = useLocation()
  const navigate = useNavigate()

  const { setUser } = useUserStore()
  const nav = useNavStore()

  const isLogin = loc.pathname === '/auth/login'

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('\u200B')

    const { name, value } = e.target
    setCreds((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { username, password } = creds

    if (username === '') {
      setError('Username is a required field.')
      return
    } else if (password === '') {
      setError('Password is a required field.')
      return
    }

    try {
      const callback = isLogin ? logIn : register
      const user = await callback(username, password)

      cacheUser(user)
      setUser(user)

      nav.show()
      navigate('/feed')
    } catch (err) {
      if (err instanceof AxiosError) setError(err.response?.data.message)
      else throw err
    }
  }

  return (
    <form
      className='flex size-full flex-col items-center sm:min-h-[600px]
          lg:min-h-[700px]'
      onSubmit={handleSubmit}
    >
      <AuthHeader title={isLogin ? 'Log In' : 'Register'} />
      <div
        className='flex h-2/6 w-full grow-[2] flex-col items-center justify-center
      gap-3 lg:h-1/6'
      >
        <p className='w-full text-center text-sm text-red-500 sm:text-lg'>
          {error}
        </p>
        <AuthInput
          autoFocus
          name='username'
          value={creds.username}
          onChange={handleChange}
        />
        <AuthInput
          name='password'
          type='password'
          value={creds.password}
          onChange={handleChange}
        />
        <input
          type='submit'
          value={isLogin ? 'Log In' : 'Register'}
          className='mt-3 h-fit w-6/12 max-w-64 
          rounded-lg bg-fg1 py-2 text-xl font-semibold text-white sm:py-4 sm:text-3xl'
        />
      </div>
      <AuthFooter
        text={isLogin ? "Don't have an account?" : 'Already have an account?'}
        linkText={isLogin ? 'Sign Up' : 'Log In'}
        linkPath={isLogin ? '/auth/register' : '/auth/login'}
      />
    </form>
  )
}
