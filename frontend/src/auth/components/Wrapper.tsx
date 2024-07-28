import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from 'src/auth/hooks'
import { acquireUser } from 'src/auth/services'

// When a user accesses any of the /auth pages this component is ran.
// It will check if there is a user cached in local storage,
// if there is it will populate this into state,
// and redirect back to where they started.
// If not the user will see the login/register page as normal.
export function Wrapper() {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const cachedUser = acquireUser()
    if (cachedUser.token !== '') {
      setUser(cachedUser)
      navigate('/users')
    }
  }, [acquireUser, setUser])

  return <Outlet />
}
