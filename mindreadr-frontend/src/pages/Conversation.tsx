import React, { type ReactElement, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import getMessages, { type MessageInfo } from '../api/getMessages'
import createMessage from '../api/createMessage'
import useAuth from '../hooks/useAuth'
import TitleBar from '../components/TitleBar'
import Message from '../components/Message'

export default function Conversation (): ReactElement {
  const [messages, setMessages] = useState<MessageInfo[]>([])
  const textRef = React.createRef<HTMLTextAreaElement>()
  const endRef = React.createRef<HTMLDivElement>()
  const params = useParams()
  const user = useAuth()

  const conversation = parseInt(params.conversation ?? '0')

  const loadMessages = useCallback(async () => {
    const res = await getMessages(conversation)
    setMessages(res)
  }, [])

  useEffect(() => { void loadMessages() }, [loadMessages])

  useLayoutEffect(() => endRef.current?.scrollIntoView(), [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const content = textRef.current?.value ?? ''
    if (content === '' || textRef.current === null) return

    const msg = await createMessage(conversation, content)
    msg.avatar = user.avatar
    setMessages((prev) => [...prev, msg])
    textRef.current.value = ''
  }

  return (
    <div className='h-[90%] flex flex-col overflow-scroll'>
      <TitleBar title='Inbox' link='/inbox'/>
      {messages.map((msg, i) => <Message key={i} msg={msg} i={i}/>)}
      <form onSubmit={handleSubmit}>
        <textarea ref={textRef} className='text-black'></textarea>
        <button type='submit'>Send</button>
      </form>
      <div className='float-left clear-both' ref={endRef}/>
    </div>
  )
}
