import React, { type ReactElement } from 'react'

interface Props {
  callback?: () => void
}

export default function BackBar ({ callback }: Props): ReactElement {
  if (callback === undefined) return <></>

  return (
    <button type='button' onClick={callback} className='font-semibold text-4xl
    leading-7 my-auto pl-3 text-purple-600 sm:text-5xl sm:leading-9'>
        &#8592;
    </button>
  )
}
