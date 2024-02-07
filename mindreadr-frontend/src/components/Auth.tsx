import type React from 'react'
import { type ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { type User } from '../App'
import { acquireUser } from '../services/auth'
import useAuth from '../hooks/useAuth'

interface Args { el: ReactElement, setUser: React.Dispatch<React.SetStateAction<User>> }

export default function Auth ({ el, setUser }: Args): ReactElement {
  const user = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const user = acquireUser()

    if (user.token !== '') {
      setUser(user)
    }
  }, [setUser])

  if (user.token !== '') nav(-1)
  return el
}
