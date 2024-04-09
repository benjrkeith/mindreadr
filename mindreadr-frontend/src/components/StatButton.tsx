import React, { type ReactElement } from 'react'

interface Props {
  stat: number
  text: string
  callback: () => void
}

export default function StatButton (props: Props): ReactElement {
  const { stat, text, callback } = props

  return (
    <button onClick={callback} className='bg-zinc-900 rounded-xl p-2 w-4/5'>
      <h1 className='text-xl sm:text-2xl'>{stat}</h1>
      <p className='text-[0.6rem] sm:text-base'>{text}</p>
    </button>
  )
}
