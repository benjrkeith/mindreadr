import React, { type ReactElement, useState } from 'react'

import Feed from '../components/Feed'
import Compose from '../components/Compose'
import { type RawPost } from '../api/getPosts'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])
  const [createPost, setCreatePost] = useState<boolean>(false)

  return (
    <div className='h-[90%] overflow-scroll'>
      {createPost && <Compose posts={posts} setPosts={setPosts} setCreatePost={setCreatePost}/>}
      {!createPost && <div className='flex'>
        <h1 className='text-white text-3xl p-3 leading-5 grow font-semibold'>Feed</h1>
        <button onClick={() => { setCreatePost(true) }} className='text-purple-600 pr-5 font-semibold'>Create post</button>
      </div>}
      {!createPost && <Feed posts={posts} setPosts={setPosts} user=''></Feed>}
    </div>
  )
}
