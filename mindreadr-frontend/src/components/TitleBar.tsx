import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  backCallback?: () => void
  btnText?: string
  btnCallback?: () => void
}

export default function TitleBar (props: Props): ReactElement {
  const { title, backCallback, btnText, btnCallback } = props

  return (
    <div className='flex py-3 bg-zinc-900 rounded-lg m-1 z-30'>
        {backCallback !== undefined &&
          <button type='button' onClick={backCallback} className='font-semibold text-4xl leading-7 my-auto
              pl-3 text-purple-600 sm:text-5xl sm:leading-9'>
            &#8592;
          </button>}
        <h1 className='text-white text-4xl px-3 leading-7 font-semibold
            sm:text-5xl sm:leading-9'>
          {title}
        </h1>
        {btnText !== undefined &&
          <button onClick={btnCallback} className='text-purple-600 font-semibold
              text-sm ml-auto px-5 sm:text-xl'>
            {btnText}
          </button>}
    </div>
  )
}
