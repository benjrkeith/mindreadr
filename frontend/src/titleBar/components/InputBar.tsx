import React, { type ReactElement } from 'react'

import { BackButton } from 'src/titleBar/components/BackButton'

interface InputBarProps extends React.HTMLProps<HTMLInputElement> {
  goBack: () => void
}

export function InputBar(props: InputBarProps): ReactElement {
  const { goBack, ...rest } = props

  return (
    <div
      className='z-10 flex bg-dark_bg_1dp shadow-[0px_6px_10px] 
      shadow-black/30'
    >
      <BackButton callback={goBack} />

      <input
        {...rest}
        type='text'
        autoFocus
        className='min-w-0 grow bg-dark_bg_1dp px-4 py-3 text-lg leading-6 
        outline-none'
      />
    </div>
  )
}
