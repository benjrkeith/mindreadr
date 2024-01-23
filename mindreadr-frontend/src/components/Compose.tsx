import React, { useState, type ReactElement, useEffect, useCallback } from 'react'

import { getAllUsernames } from '../api/getAllUsernames'
import './Compose.css'

export default function Compose (): ReactElement {
  const [input, setInput] = useState<string>('')
  const [users, setUsers] = useState<string[]>([])
  const [filtered, setFiltered] = useState<string[]>([])

  const re = /@[\w\d]+/
  const searching = (): boolean => re.test(input)

  const getUsers = useCallback(async () => {
    setUsers(await getAllUsernames())
  }, [])

  useEffect(() => { void getUsers() }, [])

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = e.target
    setInput(value)

    const query = value.match(re)
    if (query === null) return
    setFiltered(users.filter((u) => u.includes(query[0].replace('@', ''))))
  }

  function handleEnter (e: React.KeyboardEvent): void {
    if (!searching() || e.key !== 'Enter' || filtered.length === 0) return
    console.log('Confirmed Search')

    setInput((prev) => prev.replace(re, `${filtered[0]} `))
    setFiltered([])
  }

  return (
    <div className='compose-container'>
        <input type='text' value={input} onKeyDown={handleEnter} onChange={handleChange}/>
        <div className="compose-search-container">
          {filtered.map(i => <span key={i} className='compose-search-item'>{i}</span>)}
        </div>
    </div>
  )
}
