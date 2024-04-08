import type React from 'react'
import { type ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { type User } from '../App'
import { acquireUser } from '../services/auth'
import useAuth from '../hooks/useAuth'

interface Args {
  el: ReactElement
  setUser: React.Dispatch<React.SetStateAction<User>>
  setShowNav: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Auth ({ el, setUser, setShowNav }: Args): ReactElement {
  const user = useAuth()
  const nav = useNavigate()

  useEffect(() => {
    const user = acquireUser()

    if (user.token !== '') {
      setUser(user)
      setShowNav(true)
    }
  }, [setUser])

  if (user.token !== '') nav(-1)
  return el
}
