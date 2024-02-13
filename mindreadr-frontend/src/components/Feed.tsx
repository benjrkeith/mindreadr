import React, { useCallback, type ReactElement, useEffect } from 'react'

import { getPosts, type RawPost } from '../api/getPosts'
import Post from '../components/Post'

interface Props {
  posts: RawPost[]
  setPosts: React.Dispatch<React.SetStateAction<RawPost[]>>
  user: string
}

export default function Feed (props: Props): ReactElement {
  const loadMore = useCallback(async () => {
    const next = await getPosts(props.user)
    props.setPosts(next)
  }, [props.user])

  useEffect(() => { void loadMore() }, [loadMore, props.user])

  return (
    <>
      {props.posts.map(data => <Post key={data.key} data={data}/>)}
    </>
  )
}
