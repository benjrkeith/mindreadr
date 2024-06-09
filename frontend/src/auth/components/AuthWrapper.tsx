import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { acquireUser } from 'src/auth/services'
import { useNavStore, useUserStore } from 'src/store'

export function AuthWrapper({ children }: { children?: React.ReactNode }) {
  const { user, setUser } = useUserStore()
  const nav = useNavStore()

  const navigate = useNavigate()

  useEffect(() => {
    if (user.token !== '') return

    const cachedUser = acquireUser()

    if (cachedUser.token !== '') {
      setUser(cachedUser)
      nav.show()
    }
  }, [acquireUser, setUser, nav])

  useEffect(() => {
    if (user.token !== '') {
      navigate('/chats')
    }
  }, [user, navigate])

  return children || <></>
}