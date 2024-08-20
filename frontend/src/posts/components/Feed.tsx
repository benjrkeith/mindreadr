import { useInfiniteQuery } from '@tanstack/react-query'
import { InfiniteScroll } from 'src/common'

import { useNavigate } from 'react-router-dom'
import { getPosts } from 'src/posts/api'
import { Post } from 'src/posts/components/Post'
import { TitleBar } from 'src/titleBar'

export function Feed() {
  const navigate = useNavigate()

  // infinite query for getting posts
  const postQuery = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam }) => getPosts(pageParam, 8),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length !== 8 ? undefined : lastPageParam + 8,
    select: (data) => ({
      pages: [...data.pages].reverse(),
    }),
  })

  return (
    <div className='flex grow flex-col overflow-hidden'>
      <TitleBar
        title='Feed'
        actions={[{ text: 'Create Post', callback: () => navigate('new') }]}
      />
      <InfiniteScroll infQuery={postQuery} InnerComponent={Post} />
    </div>
  )
}
