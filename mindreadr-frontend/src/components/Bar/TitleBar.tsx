import React, { type ReactElement } from 'react'

import BackBtn from './BackBtn'

interface Props {
  backCallback?: () => void
  title: string
  btnText?: string
  btnCallback?: () => void
}

export default function TitleBar (props: Props): ReactElement {
  const { backCallback, title, btnText, btnCallback } = props

  return (
    <div className='flex py-3 bg-zinc-900 rounded-lg m-1'>
      <BackBtn callback={backCallback} />
      <h1 className='text-4xl leading-7 font-semibold pl-3 sm:text-5xl sm:leading-9'>
        {title}
      </h1>

      {btnText !== undefined && btnCallback !== undefined &&
        <button onClick={btnCallback} className='text-purple-600 font-semibold
        text-sm ml-auto px-5 sm:text-xl'>
          {btnText}
        </button>
      }
    </div>
  )
}
