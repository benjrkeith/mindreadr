import { useUserStore } from 'src/store'

export function useAuth() {
  const { user } = useUserStore()
  return user
}
