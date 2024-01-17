import axios from 'axios'
import React, { useState, type FormEvent, type ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'

import { API_URL } from '../App'

export default function Register (): ReactElement {
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const AUTH_URL = `${API_URL}/auth/login`

  async function handleSubmit (e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()

    try {
      const res = await axios.post(`${AUTH_URL}/register`, { username, password })
      if (res.status === 200) navigate('/login')
    } catch (err) {
      if (!(err instanceof axios.AxiosError)) throw err
      else setError(err.response?.data.err)
    }
  }

  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      {error !== '' && <p>{error}</p>}
      <div className='auth-creds-container'>
        <input
          className='auth-creds-input'
          required
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />
        <input
        className='auth-creds-input'
          required
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
        />
      </div>

      <div className='auth-buttons-container'>
        <input
          className='auth-button auth-button-register'
          type='button'
          value='Login'
          onClick={() => { navigate('/login') }}
        />
        <input className='auth-button auth-button-login' type='submit' value='Register' />
      </div>
    </form>
  )
}
