import React, { type ReactElement } from 'react'

import { useTitleBarStore } from 'src/store'
import { BackButton } from 'src/titleBar/components/BackButton'

interface Props {
  placeholder: string
  query: string
  setQuery: (query: string) => void
  submitCallback: () => void
}

export function InputBar(props: Props): ReactElement {
  const { placeholder, query, setQuery, submitCallback } = props
  const { backCallback } = useTitleBarStore()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submitCallback()
  }

  return (
    <div
      className='m-1 mb-0 box-border flex rounded-lg border-b-[2px] border-solid 
    border-bg2 bg-bg1 leading-10'
    >
      <BackButton callback={backCallback} />

      <input
        type='text'
        autoFocus
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value)
        }}
        className='my-2 grow bg-bg1 px-4 py-2 text-xl leading-8 outline-none'
        onKeyDown={handleKeyDown}
      />

      <button
        className='aspect-square rounded-lg bg-fg1 px-6 py-0'
        onClick={submitCallback}
        tabIndex={-1}
      >
        Go
      </button>
    </div>
  )
}
