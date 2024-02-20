import { useContext } from 'react'
import { userCtx, type User } from '../App'

export default function useAuth (): User {
  const user = useContext(userCtx)
  return user
};
