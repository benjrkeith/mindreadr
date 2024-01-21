import React, { useCallback, type ReactElement, useEffect, useState } from 'react'

import { getPosts, type RawPost } from '../api/getPosts'
import Post from '../components/Post'

interface Props {
  user: string
}

export default function Feed (props: Props): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])

  const loadMore = useCallback(async () => {
    const next = await getPosts(props.user)
    setPosts(next)
  }, [])

  useEffect(() => { void loadMore() }, [loadMore])

  return (
    <div className='feed-container'>
      {posts.map(data => <Post key={data.key} data={data}/>)}
    </div>
  )
}
