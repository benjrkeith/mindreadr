import React, { type ReactElement, useContext, useEffect } from 'react'
import { Navigate } from 'react-router-dom'

import { userCtx, type User } from '../App'
import { acquireUser } from '../services/Auth'

interface Args { el: ReactElement, setUser: React.Dispatch<React.SetStateAction<User>> }

export default function Auth ({ el, setUser }: Args): ReactElement {
  const user = useContext(userCtx)

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
