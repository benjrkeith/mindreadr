import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  title: string
  link?: string
}

export default function TitleBar ({ title, link }: Props): ReactElement {
  return (
    <div className='flex sticky top-0 bg-grey'>
        {link !== undefined && <Link to={link} className='font-semibold
            text-4xl my-auto pl-3'>&#8592;</Link>}
        <h1 className='text-white text-4xl p-3 leading-7 font-semibold'>
          {title}
        </h1>
    </div>
  )
}
