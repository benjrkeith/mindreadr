import { Navigate, Outlet } from 'react-router-dom'

import { useAuth } from 'src/auth/hooks'

// This component protects a route and only allows logged in users to access it.
// If user is not logged in they are redirected to login page,
// once there AuthWrapper will try to auto log in and return them back here.
// Otherwise they can log in manually and be redirected back here.
export function Protected() {
  const { user } = useAuth()
  if (user.token === '') return <Navigate to='/auth/login' />
  else return <Outlet />
}
