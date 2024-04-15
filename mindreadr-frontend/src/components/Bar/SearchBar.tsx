import React, { type ReactElement } from 'react'

import BackBtn from './BackBtn'

interface Props {
  backCallback?: () => void
  query: string
  setQuery: (query: string) => void
  handleKeyDown: (e: React.KeyboardEvent) => void
}

export default function SearchBar (props: Props): ReactElement {
  const { backCallback, query, setQuery, handleKeyDown } = props

  return (
    <div className='flex py-3 bg-zinc-900 rounded-lg m-1'>
      <BackBtn callback={backCallback} />

      <input type='text' autoFocus value={query} onKeyDown={handleKeyDown}
      onChange={(e) => { setQuery(e.target.value) }} placeholder='Search...'
      className='bg-zinc-900 grow outline-none px-3'/>
    </div>
  )
}
