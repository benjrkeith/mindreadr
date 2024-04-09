import React, { useEffect, type ReactElement, useCallback, useState } from 'react'

import UserList from './UserList'

import { type User } from '../api/common'
import getFollowers from '../api/getFollowers'

interface Props {
  target: string
}

export default function Followers ({ target }: Props): ReactElement {
  const [followers, setFollowers] = useState<User[]>([])

  const callback = useCallback(async () => {
    setFollowers(await getFollowers(target))
  }, [getFollowers, target])

  useEffect(() => { void callback() }, [callback, target])

  return (
    <UserList users={followers}/>
  )
}
