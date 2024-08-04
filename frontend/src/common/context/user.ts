import { createContext } from 'react'

import * as types from 'src/common/types'
import { emptyUser } from 'src/common/types/emptyUser'

interface UserContext {
  user: types.User
  setUser: (user: types.User) => void
}

export const userCtx = createContext<UserContext>({
  user: emptyUser,
  setUser: () => {},
})
