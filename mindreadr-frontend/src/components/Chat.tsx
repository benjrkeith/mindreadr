import React, {
  type ReactElement,
  type FormEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from 'react'

import Message from './Message'
import TitleBar from './TitleBar'

import useAuth from '../hooks/useAuth'

import { type Msg } from '../api/common'
import createMsg from '../api/createMsg'
import getChat from '../api/getChat'

import enter from '../assets/enter.png'

interface Props {
  id: number
  closeChat: () => void
}

export default function Chat ({ id, closeChat }: Props): ReactElement {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const user = useAuth()

  const inputRef = React.createRef<HTMLTextAreaElement>()
  const bottomRef = React.createRef<HTMLDivElement>()

  const loadMessages = useCallback(async () => {
    const res = await getChat(id)
    console.log(res)
    setMsgs(res)
  }, [getChat, id])

  useEffect(() => { void loadMessages() }, [loadMessages, id])
  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView()
  }, [msgs])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (inputRef.current === null) return
    const content = inputRef.current.value
    if (content.length < 1) return

    const msg = await createMsg(id, content)
    msg.author.avatar = user.avatar

    setMsgs((prev) => [...prev, msg])
    inputRef.current.value = ''
  }

  return (
    <div className='absolute bottom-0 w-full overflow-hidden h-full flex flex-col'>
      <TitleBar title='Inbox' backCallback={() => { closeChat() }}/>
      <div className='overflow-scroll grow'>
        {msgs.map((msg, i) => <Message key={i} i={i} msg={msg}/>)}
        <div className='float-left clear-both' ref={bottomRef}/>
      </div>
      <form onSubmit={handleSubmit} className='flex mx-2 my-3 gap-2'>
        <textarea ref={inputRef} rows={2}
          className='resize-none grow p-2 bg-zinc-900 rounded-lg
            text-white outline-none border-transparent focus:outline-purple-600'/>
        <button type='submit' className='bg-purple-600 rounded-lg aspect-square m-1'>
          <img src={enter} alt='send' className='h-14 mx-auto filter-white' />
        </button>
      </form>
    </div>
  )
}
