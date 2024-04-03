import React, { type ReactElement, useCallback, useEffect, useState } from 'react'

import ConversationPreview from '../components/ConversationPreview'
import TitleBar from '../components/TitleBar'
import UserSearch from '../components/UserSearch'
import createConversation from '../api/createConversation'
import getInbox, { type Conversation } from '../api/getInbox'

export default function Inbox (): ReactElement {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)

  const loadInbox = useCallback(async () => {
    const res = (await getInbox()).reverse()
    setConversations(res)
  }, [getInbox])

  useEffect(() => { void loadInbox() }, [loadInbox])

  const onNewMessage = (): void => {
    setShowSearch(true)
  }

  return (
    <div className='h-[90%] flex flex-col overflow-scroll'>
      <TitleBar title='Inbox' btnText='New Chat' btnCallback={onNewMessage}/>
      {showSearch && <UserSearch callback={createConversation} hide={() => { setShowSearch(false) }}/>}
      {conversations.map((conv, i) =>
        <ConversationPreview key={i} conversation={conv} i={i}/>)}
    </div>
  )
}
