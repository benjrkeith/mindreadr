import React, { useCallback, type ReactElement, useEffect, useState } from 'react'

import { getPosts, type RawPost } from '../api/getPosts'
import Post from '../components/Post'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost>([])

  const loadMore = useCallback(async () => {
    const next = await getPosts()
    setPosts(next[0])
  }, [])

  useEffect(() => { void loadMore() }, [loadMore])

  return (
    <div className='feed-container'>
      <Post data={posts}/>
    </div>
  )
}
