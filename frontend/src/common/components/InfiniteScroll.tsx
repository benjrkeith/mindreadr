import { UseInfiniteQueryResult } from '@tanstack/react-query'
import _ from 'lodash'
import { useLayoutEffect, useRef, useState } from 'react'

import { Message } from 'src/chats/components/Message'
import { types } from 'src/common'
import { JumpDown } from 'src/common/components/JumpDown'

interface InfiniteScrollProps {
  infQuery: UseInfiniteQueryResult<{ pages: types.Message[][] }, Error>
}

// An inifinte scroll component that uses a tanstack query infinite query.
// Needs virtualization as will not perform well with large data sets.
export function InfiniteScroll({ infQuery }: InfiniteScrollProps) {
  const divRef = useRef<HTMLDivElement>(null)

  const [lastHeight, setLastHeight] = useState(-1)
  const [isAtBottom, setIsAtBottom] = useState(true)

  // when new messages are added above, scroll back to the previous position
  useLayoutEffect(() => {
    const div = divRef.current
    if (infQuery.data === undefined || div === null) return

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
    if (atTop && infQuery.hasNextPage && !infQuery.isFetchingNextPage) {
      setLastHeight(t.scrollHeight)
      infQuery.fetchNextPage()
    }
  }

  // helper to scroll to bottom of all messages
  const jumpToBottom = (bhvr: ScrollBehavior) => {
    divRef.current?.scrollTo({
      top: divRef.current.scrollHeight,
      left: 0,
      behavior: bhvr,
    })
  }

  if (infQuery.data === undefined) return <></>
  else
    return (
      <>
        <div
          ref={divRef}
          className='mt-auto overflow-y-scroll'
          onScroll={_.throttle(handleScroll, 250)}
        >
          {infQuery.data.pages.flat(1).map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
        </div>

        {!isAtBottom && <JumpDown callback={jumpToBottom} />}
      </>
    )
}
