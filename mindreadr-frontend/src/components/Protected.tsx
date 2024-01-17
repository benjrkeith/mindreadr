import React, { useContext, type ReactElement } from 'react'
import { Navigate } from 'react-router-dom'

import { userCtx } from '../App'

interface Args { el: JSX.Element }

export default function Protected ({ el }: Args): ReactElement {
  const user = useContext(userCtx)

  if (user.token === '') {
    return <Navigate to='/login' />
  }

  return el
}
