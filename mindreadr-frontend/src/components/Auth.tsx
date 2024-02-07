import React, { type ReactElement, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { type User } from '../App'
import { acquireUser } from '../services/auth'
import useAuth from '../hooks/useAuth'

interface Args { el: ReactElement, setUser: React.Dispatch<React.SetStateAction<User>> }

export default function Auth ({ el, setUser }: Args): ReactElement {
  const user = useAuth()

  useEffect(() => {
    const user = acquireUser()

    if (user.token !== '') {
      setUser(user)
    }
  }, [setUser])

  if (user.token !== '') {
    return <Navigate to='/feed' />
  }

  return el
}
