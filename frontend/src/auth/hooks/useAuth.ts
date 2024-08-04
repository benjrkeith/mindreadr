import { useContext } from 'react'

import { userCtx } from 'src/common'

export function useAuth() {
  const ctx = useContext(userCtx)
  return ctx
}
