import { Navigate } from 'react-router-dom'

import { useUserStore } from 'src/store'

export function Protected({ element }: { element: React.ReactNode }) {
  const { user } = useUserStore()

  if (user.token === '') {
    return <Navigate to='/auth/login' />
  }

  return element
}
