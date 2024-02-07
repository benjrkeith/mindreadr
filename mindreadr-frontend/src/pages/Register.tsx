import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, type FormEvent, type ReactElement } from 'react'

import { AUTH_URL } from '../api/common'

export default function Register (): ReactElement {
  const [error, setError] = useState('')
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
      if (res.status === 200) navigate('/login')
    } catch (err) {
      if (!(err instanceof axios.AxiosError)) throw err
      else setError(err.response?.data.err)
    }
  }

  return (
    <form className='h-full grid grid-rows-9 gap-5 pl-3 pr-3 justify-items-center' onSubmit={handleSubmit}>
      <h1 className='row-[2/2] text-center text-4xl font-bold text-white'>Register</h1>
      <input type='text' placeholder='Username' value={username}
        onChange={(e) => { setUsername(e.target.value) }}
        className='row-[4/4] text-center rounded-full p-2 pl-5 pr-5  w-5/6'
      />
      <input type='password' placeholder='Password' value={password}
        onChange={(e) => { setPassword(e.target.value) }}
        className='row-[5/5] text-center rounded-full p-2 pl-5 pr-5  w-5/6'
      />
      <input type='submit' value='Register' className='rounded-full bg-purple-600 text-xl pb-2 pt-2 pl-5 pr-5
        text-white font-semibold row-[6/6] w-5/6 leading-4'/>
      {error === ''
        ? <></>
        : <div className='row-[3/3] flex items-end'>
        <p className='text-red-500 text-center w-full h-fit'>• {error}</p></div>}
      <div className='row-[9/9] flex items-center mb-4 m-[auto]'>
        <p className='text-sm pr-2 text-white'>Already have an account?</p>
        <Link to='/login' className='text-center text-purple-600 text-sm row-[8/8]'>Log In</Link>
      </div>
    </form>
  )
}
