import { UseInfiniteQueryResult } from '@tanstack/react-query'
import _ from 'lodash'
import { Fragment, useLayoutEffect, useRef, useState } from 'react'

import JumpDown from 'src/chats/components/JumpDown'
import { Message } from 'src/chats/components/Message'
import { types } from 'src/common'

interface InfiniteScrollProps {
  infQuery: UseInfiniteQueryResult<{ pages: types.Message[][] }, Error>
}

export function InfiniteScroll(props: InfiniteScrollProps) {
  const { infQuery } = props

  const [atBottom, setAtBottom] = useState(true)
  const [lastHeight, setLastHeight] = useState(0)
  const [prePending, setPrePending] = useState(false)
  const divRef = useRef<HTMLDivElement>(null)

  // ref and helper to scroll to bottom of all messages
  const jumpToBottom = (bhvr: ScrollBehavior) => {
    divRef.current?.scrollTo({
      top: divRef.current.scrollHeight,
      left: 0,
      behavior: bhvr,
    })
  }

  // when new messages are added above, scroll back to the previous position
  useLayoutEffect(() => {
    const ref = divRef.current
    if (infQuery.data === undefined || ref === null) return

    if (atBottom) jumpToBottom('instant')
    else if (prePending) {
      setPrePending(false)
      if (infQuery.data.pages.length > 1)
        ref.scrollTo({
          top: ref.scrollHeight - lastHeight,
          left: 0,
          behavior: 'instant',
        })
    }
  }, [infQuery.data])

  // scroll event for infinite messages div
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const t = e.target as HTMLDivElement

    // used to display jump down button
    const _atBottom = t.scrollTop + t.clientHeight >= t.scrollHeight - 10
    if (_atBottom !== atBottom) setAtBottom(_atBottom)

    // used to infinite scroll upwards for previous messages
    const atTop = t.scrollTop <= 10
    if (atTop && infQuery.hasNextPage && !infQuery.isFetchingNextPage) {
      setLastHeight(t.scrollHeight)
      setPrePending(true)
      infQuery.fetchNextPage()
    }
  }

  if (infQuery.data === undefined) return <></>
  else
    return (
      <>
        <div
          className='mt-auto overflow-y-scroll'
          ref={divRef}
          onScroll={_.throttle(handleScroll, 250)}
        >
          {infQuery.data.pages.map((page, i) => (
            <Fragment key={i}>
              {page.map((msg) => (
                <Message key={msg.id} msg={msg} />
              ))}
            </Fragment>
          ))}
        </div>
        {!atBottom && <JumpDown callback={jumpToBottom} />}
      </>
    )
}
