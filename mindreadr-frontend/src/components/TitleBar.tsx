import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  link?: string
  btnText?: string
  btnCallback?: () => void
}

export default function TitleBar (props: Props): ReactElement {
  const { title, link, btnText, btnCallback } = props

  return (
    <div className='flex sticky top-0 bg-grey'>
        {link !== undefined && <Link to={link} className='font-semibold
            text-4xl my-auto pl-3 text-purple-600'>&#8592;</Link>}
        <h1 className='text-white text-4xl p-3 leading-7 font-semibold'>
          {title}
        </h1>
        {btnText !== undefined && <button onClick={btnCallback} className='
          text-purple-600 grow font-semibold text-end p-3'>{btnText}</button>}
    </div>
  )
}
