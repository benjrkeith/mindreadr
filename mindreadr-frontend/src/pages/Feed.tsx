import React, { type ReactElement, useState } from 'react'

import Feed from '../components/Feed'
import Compose from '../components/Compose'
import { type RawPost } from '../api/getPosts'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])

  return (
    <div className='h-[90%] overflow-scroll'>
      <Compose posts={posts} setPosts={setPosts}/>
      <Feed posts={posts} setPosts={setPosts} user=''></Feed>
    </div>
  )
}
