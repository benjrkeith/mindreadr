import { UseInfiniteQueryResult } from '@tanstack/react-query'
import _ from 'lodash'
import { FC, useLayoutEffect, useRef, useState } from 'react'

import { JumpDown } from 'src/common/components/JumpDown'
import { JumpUp } from './JumpUp'

interface InfiniteScrollProps {
  reverse?: boolean
  infQuery: UseInfiniteQueryResult<{ pages: any[][] }, Error>
  InnerComponent: FC<{ data: any }>
}

// An infinite scroll component that uses a tanstack query infinite query.
// Needs virtualization as will not perform well with large data sets.
export function InfiniteScroll({
  reverse = false,
  infQuery,
  InnerComponent,
}: InfiniteScrollProps) {
  const divRef = useRef<HTMLDivElement>(null)

  const [lastHeight, setLastHeight] = useState(-1)
  const [isAtBottom, setIsAtBottom] = useState(reverse)
  const [isAtTop, setIsAtTop] = useState(!reverse)

  // reverse only, when new messages are added above, scroll back to the previous position
  useLayoutEffect(() => {
    const div = divRef.current
    if (!reverse || infQuery.data === undefined || div === null) return

    // if we were already at the bottom, scroll to the new bottom
    if (isAtBottom) jumpToBottom('instant')
    // otherwise keep the same scroll position
    else if (lastHeight !== -1) {
      if (infQuery.data.pages.length > 1) {
        div.scrollTo({
          top: div.scrollHeight - lastHeight,
          left: 0,
          behavior: 'instant',
        })
        setLastHeight(-1)
      }
    }
  }, [infQuery.data])

  // scroll event for infinite messages div
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const t = e.target as HTMLDivElement

    // if not at bottom of page display jump down button
    const _isAtBottom = t.scrollTop + t.clientHeight >= t.scrollHeight - 10
    if (_isAtBottom !== isAtBottom) setIsAtBottom(_isAtBottom)

    // if at top of page load more messages
    const atTop = t.scrollTop <= 10
    if (atTop !== isAtTop) setIsAtTop(atTop)

    if (
      reverse &&
      atTop &&
      infQuery.hasNextPage &&
      !infQuery.isFetchingNextPage
    ) {
      setLastHeight(t.scrollHeight)
      infQuery.fetchNextPage()
    } else if (
      !reverse &&
      _isAtBottom &&
      infQuery.hasNextPage &&
      !infQuery.isFetchingNextPage
    )
      infQuery.fetchNextPage()
  }

  // helper to scroll to bottom of all messages
  const jumpToBottom = (bhvr: ScrollBehavior) => {
    divRef.current?.scrollTo({
      top: divRef.current.scrollHeight,
      left: 0,
      behavior: bhvr,
    })
  }

  // helper to scroll to top of all messages
  const jumpToTop = (bhvr: ScrollBehavior) => {
    divRef.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: bhvr,
    })
  }

  if (infQuery.data === undefined) return <></>
  else {
    let pages = infQuery.data.pages.flat(1)
    if (!reverse) pages = pages.reverse()
    return (
      <>
        {!reverse && !isAtTop && <JumpUp callback={jumpToTop} />}

        <div
          ref={divRef}
          className='mt-auto flex flex-col overflow-y-scroll'
          onScroll={_.throttle(handleScroll, 250)}
        >
          {pages.map((data) => (
            <InnerComponent key={data.id} data={data} />
          ))}
        </div>

        {reverse && !isAtBottom && <JumpDown callback={jumpToBottom} />}
      </>
    )
  }
}
