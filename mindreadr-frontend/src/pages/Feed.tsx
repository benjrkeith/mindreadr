import React, { type ReactElement, useState } from 'react'

import Feed from '../components/Feed'
import Compose from '../components/Compose'
import { type RawPost } from '../api/getPosts'
import TitleBar from '../components/TitleBar'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])
  const [createPost, setCreatePost] = useState<boolean>(false)

  return (
    <div className='h-[90%] overflow-scroll'>
      {createPost &&
        <Compose posts={posts} setPosts={setPosts} setCreatePost={setCreatePost}/>}
      <TitleBar title='Feed' btnText='Create Post' btnCallback={() => { setCreatePost(true) }}/>
      {!createPost &&
        <Feed posts={posts} setPosts={setPosts} user=''/>}
    </div>
  )
}
