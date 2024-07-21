import { createContext } from 'react'

import * as types from 'src/common/types'

interface UserContext {
  user: types.User
  setUser: (user: types.User) => void
}

export const userCtx = createContext<UserContext>({
  user: types.emptyUser,
  setUser: () => {},
})
