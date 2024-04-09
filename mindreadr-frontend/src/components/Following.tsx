import React, { useEffect, type ReactElement, useCallback, useState } from 'react'

import { type User } from '../api/common'
import { getFollowing } from '../api/getFollowing'
import UserList from './UserList'

interface Props {
  target: string
}

export default function Following ({ target }: Props): ReactElement {
  const [following, setFollowing] = useState<User[]>([])

  const callback = useCallback(async () => {
    const res = await getFollowing(target)
    setFollowing(res)
  }, [getFollowing, target])

  useEffect(() => { void callback() }, [callback, target])

  return (
    <UserList users={following}/>
  )
}
