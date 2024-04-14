import React, { type ReactElement } from 'react'

import { type Msg } from '../api/common'

interface Props {
  i: number
  msg: Msg
}

export default function Message ({ i, msg }: Props): ReactElement {
  const avatar = msg.author.avatar
  const date = new Date(msg.createdAt)

  return (
    <div className={`flex p-3 ${i % 2 === 0 ? 'bg-zinc-900' : ''}`}>
      <img src={`data:image/jpeg;base64,${avatar}`} alt='avatar' className='h-[3.2rem] my-auto rounded-full'/>
      <div className='flex flex-col pl-3 w-full'>
        <div className='flex w-full py-1'>
          <h1 className='text-2xl leading-7'>{msg.author.username}</h1>
          <p className='text-xs my-auto w-full text-end'>
            {date.toLocaleString().substring(0, 17)}
          </p>
        </div>
        <p className='text-sm'>{msg.content}</p>
      </div>
    </div>
  )
}
