import React, { type ReactElement, useCallback, useEffect, useState } from 'react'
import io, { type Socket } from 'socket.io-client'

import Chat from '../components/Chat'
import ChatPreview from '../components/ChatPreview'
import TitleBar from '../components/TitleBar'
// import UserSearch from '../components/UserSearch'

import { type Msg, type ChatMeta } from '../api/common'
// import createConversation from '../api/createConversation'
import getInbox from '../api/getInbox'

interface Props {
  setShowNav: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Inbox ({ setShowNav }: Props): ReactElement {
  const [chats, setChats] = useState<ChatMeta[]>([])
  const [showSearch, setShowSearch] = useState<boolean>(false)
  const [focusedChat, setFocusedChat] = useState<number>(-1)
  const [newMsg, setNewMsg] = useState<Msg>()
  const [socket, setSocket] = useState<Socket>()

  useEffect(() => {
    if (socket === undefined) setSocket(io('http://192.168.0.129:4000'))
    return (): void => { socket?.disconnect() }
  }, [])

  useEffect(() => {
    if (socket === undefined) return

    socket.on('connect', () => {
      console.log('connected')
    })
    socket.on('disconnect', () => {
      console.log('disconnected')
    })
    socket.on('message', (msg) => {
      setNewMsg(msg)
    })
  }, [socket])

  const loadInbox = useCallback(async () => {
    const res = await getInbox()
    setChats(res)
  }, [getInbox])

  useEffect(() => { void loadInbox() }, [loadInbox])

  const onNewMessage = (): void => {
    setShowSearch(true)
  }

  const openChat = (i: number, key: number): void => {
    setFocusedChat(key)
    setShowNav(false)
    socket?.emit('join', key.toString())

    setChats((prev) => {
      prev[i].read = true
      return prev
    })
  }

  const closeChat = (): void => {
    socket?.emit('leave', focusedChat.toString())
    setFocusedChat(-1)
    setShowNav(true)
  }

  return (
    <div className='h-[90%] flex flex-col'>
      {focusedChat === -1
        ? <>
            <TitleBar title='Inbox' btnText='New Chat' btnCallback={onNewMessage}/>
            <div className='overflow-scroll grow'>
              {chats.map((chat, i) =>
                <ChatPreview key={i} i={i} chat={chat} openChat={() => {
                  openChat(i, chat.key)
                }}/>)}
            </div>
          </>
        : <Chat id={focusedChat} newMsg={newMsg} closeChat={closeChat}/>}
    </div>
  )
}
//       {showSearch && <UserSearch callback={createConversation} hide={() => { setShowSearch(false) }}/>}
