import React, { type ReactElement, useCallback, useEffect, useState } from 'react'

import getInbox, { type Conversation } from '../api/getInbox'
import TitleBar from '../components/TitleBar'
import ConversationPreview from '../components/ConversationPreview'

export default function Inbox (): ReactElement {
  const [conversations, setConversations] = useState<Conversation[]>([])

  const loadInbox = useCallback(async () => {
    const res = await getInbox()
    setConversations(res)
  }, [getInbox])

  useEffect(() => { void loadInbox() }, [loadInbox])

  return (
    <div className='h-[90%] flex flex-col overflow-scroll'>
      <TitleBar title='Inbox' btnText='New Message' btnCallback={() => { console.log('test') }}/>
      {conversations.map((conv, i) =>
        <ConversationPreview key={i} conversation={conv} i={i}/>)}
    </div>
  )
}
