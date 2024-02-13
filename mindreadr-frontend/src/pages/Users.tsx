import React, { type ReactElement, useState } from 'react'
import { useParams } from 'react-router-dom'

import Feed from '../components/Feed'
import UserInfo from '../components/UserInfo'
import useAuth from '../hooks/useAuth'
import { type RawPost } from '../api/getPosts'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])
  const params = useParams()
  const user = useAuth()

  const target = params['*'] === '' ? user.username : params['*']

  if (target === undefined) return <></>

  return (
  <div className='h-[90%] flex flex-col overflow-scroll'>
    <UserInfo user={target}/>
    <Feed posts={posts} setPosts={setPosts} user={target}/>
  </div>

  )
}
