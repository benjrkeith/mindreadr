import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, type FormEvent, type ReactElement } from 'react'

import { AUTH_URL } from '../api/common'

export default function Register (): ReactElement {
  const [error, setError] = useState('\u200B')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const URL = `${AUTH_URL}/register`

  async function handleSubmit (e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    if (username === '') {
      setError('Username is a required field.')
      return
    } else if (password === '') {
      setError('Password is a required field.')
      return
    }

    try {
      const res = await axios.post(`${URL}`, { username, password })
      if (res.status === 200) {
        setUsername('')
        setPassword('')

        const msg = 'Account created. Redirecting in '
        setError(msg + '3s')
        setTimeout(() => { setError(msg + '2s') }, 1000)
        setTimeout(() => { setError(msg + '1s') }, 2000)
        setTimeout(() => { navigate('/login') }, 3000)
      }
    } catch (err) {
      if (!(err instanceof axios.AxiosError)) throw err
      else setError(err.response?.data.err)
    }
  }

  return (
    <form className='h-full flex flex-col items-center sm:min-h-[600px]
          lg:min-h-[700px]'
        onSubmit={handleSubmit}>
      <div className='flex items-end grow-[1]'>
        <h1 className='text-5xl font-bold justify-end italic sm:text-7xl'>
          Register
        </h1>
      </div>
      <div className='flex flex-col w-full gap-3 h-2/6 items-center grow-[2]
          justify-center lg:h-1/6'>
        <div className='flex items-end w-full'>
          <p className='text-red-500 text-center w-full text-sm sm:text-lg'>
            {error}
          </p>
        </div>
        <input type='text' placeholder='Username' value={username}
          onChange={(e) => { setUsername(e.target.value) }} spellCheck='false'
          className='text-center text-black rounded-lg w-10/12 h-fit
            py-2 max-w-96 sm:text-2xl sm:py-4'
        />
        <input type='password' placeholder='Password' value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          className='text-center text-black rounded-lg w-10/12 h-fit
            py-2 max-w-96 sm:text-2xl sm:py-4'
        />
        <input type='submit' value='Register' className='rounded-lg bg-purple-600
          text-white font-semibold w-6/12 max-w-64 text-xl py-2 h-fit mt-3
          sm:text-3xl sm:py-4'/>
      </div>
      <div className='flex items-end w-full mx-auto mb-2 justify-evenly grow-[1]
        sm:mb-5 lg:items-start'>
        <p className='text-sm text-white sm:text-xl'>
          Already have an account?
          <Link to='/login' className='text-purple-600 text-base
            sm:text-2xl'> Log in</Link>
        </p>
      </div>
    </form>
  )
}
