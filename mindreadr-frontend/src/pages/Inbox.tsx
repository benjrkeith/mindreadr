import React, { type ReactElement, useCallback, useEffect, useState } from 'react'

import Chat from '../components/Chat'
import ChatPreview from '../components/ChatPreview'
import TitleBar from '../components/TitleBar'
import UserSearch from '../components/UserSearch'

import createConversation from '../api/createConversation'
import getInbox from '../api/getInbox'
import { type ChatMeta } from '../api/common'

interface Props {
  setShowNav: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Inbox ({ setShowNav }: Props): ReactElement {
  const [chats, setChats] = useState<ChatMeta[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [focusedChat, setFocusedChat] = useState<number>(-1)

  const loadInbox = useCallback(async () => {
    const res = await getInbox()
    setChats(res)
  }, [getInbox])

  useEffect(() => { void loadInbox() }, [loadInbox])

  const onNewMessage = (): void => {
    setShowSearch(true)
  }

  const openChat = (i: number): void => {
    setFocusedChat(i)
    setShowNav(false)
  }

  const closeChat = (): void => {
    setFocusedChat(-1)
    setShowNav(true)
  }

  return (
    <div className='h-[90%] flex flex-col overflow-scroll'>
      {focusedChat === -1
        ? <>
            <TitleBar title='Inbox' btnText='New Chat' btnCallback={onNewMessage}/>
            {chats.map((chat, i) => <ChatPreview key={i} i={i} chat={chat} openChat={() => { openChat(chat.key) }}/>)}
          </>
        : <Chat id={focusedChat} closeChat={closeChat}/>}
    </div>
  )
}
//       {showSearch && <UserSearch callback={createConversation} hide={() => { setShowSearch(false) }}/>}
