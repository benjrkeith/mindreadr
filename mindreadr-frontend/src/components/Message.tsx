import React, { type ReactElement } from 'react'

interface Props {
  msg: {
    avatar: string
    author: string
    created_at: string
    content: string
  }
  i: number
}

export default function Message ({ msg, i }: Props): ReactElement {
  return (
    <div key={i} className={`flex p-3 ${i % 2 === 0 ? 'bg-zinc-900' : ''}`}>
        <img src={msg.avatar} alt='avatar' className='h-12 rounded-full'/>
        <div className='flex flex-col pl-3 w-full'>
            <div className='flex w-full'>
                <h1 className='text-2xl leading-7'>{msg.author}</h1>
                <p className='text-xs my-auto w-full text-end'>
                    {new Date(msg.created_at).toLocaleString().substring(0, 17)}
                </p>
            </div>
            <p className='text-sm'>{msg.content}</p>
        </div>
    </div>
  )
}
