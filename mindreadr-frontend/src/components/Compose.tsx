import React, { useState, type ReactElement, useEffect, useCallback, useLayoutEffect } from 'react'

import { getAllUsernames } from '../api/getAllUsernames'
import './Compose.css'

export default function Compose (): ReactElement {
  const [input, setInput] = useState<string>('')
  const [users, setUsers] = useState<string[]>([])
  const [filtered, setFiltered] = useState<string[]>([])
  const [offset, setOffset] = useState<number>(0)
  const [targetUser, setTargetUser] = useState<number>(0)

  const inputRef = React.useRef<HTMLDivElement>(null)

  const re = /[^>]@[\w\d]+/g

  const getUsers = useCallback(async () => {
    setUsers(await getAllUsernames())
  }, [setUsers, getAllUsernames])

  useEffect(() => { void getUsers() }, [getUsers])

  useLayoutEffect(() => {
    if (offset === 0 || inputRef.current === null) return
    const childNodes = Array.from(inputRef.current.childNodes)

    let cumulativeLength = 0
    let targetNode = null
    let targetOffset = 0

    for (const node of childNodes) {
      if (node.textContent === null) return

      if (cumulativeLength + node.textContent.length >= offset) {
        targetNode = node.childNodes.length === 0 ? node : node.childNodes[0]
        targetOffset = offset - cumulativeLength
        break
      } else {
        cumulativeLength += node.textContent.length
      }
    }

    if (targetNode === null) return

    const newRange = document.createRange()
    newRange.setStart(targetNode, targetOffset)

    const selection = document.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(newRange)
  })

  function handleInput (e: React.ChangeEvent<HTMLInputElement>): void {
    const value = e.target.innerHTML ?? ''
    setInput(value)

    const range = document.getSelection()?.getRangeAt(0)
    if (range === null || range === undefined) return

    const clone = range.cloneRange()
    clone.selectNodeContents(inputRef.current as HTMLDivElement)
    clone.setEnd(range.endContainer, range.endOffset)
    const newOffset = clone.toString().length
    setOffset(newOffset)

    const newInput = ` ${value}`
    const match = newInput.match(re)

    if (match === null) {
      setFiltered([])
      setTargetUser(0)
    } else {
      setFiltered(users.filter((u) => u.startsWith(match[0].replace(' @', ''))))
    }
  }

  function handleKeyDown (e: React.KeyboardEvent): void {
    const textInput = inputRef.current
    if (textInput === null) return

    if (textInput.innerText.length >= 140 && e.key !== 'Backspace') {
      // display error char limit reached
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (targetUser < filtered.length - 1) setTargetUser(prev => prev + 1)
      return
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (targetUser > 0) setTargetUser(prev => prev - 1)
      return
    }

    if (e.key === 'Enter') e.preventDefault()
    if (e.key !== 'Enter' || filtered.length === 0) return

    let newInput = ` ${input}`
    const match = newInput.match(re)
    if (match === null) return

    newInput = newInput.replace(re, ` <span class='blue'>@${filtered[targetUser]}</span>\u200B`)
    setInput(newInput)
    setOffset(prev => prev + filtered[targetUser].length - match[0].length + 4)
    setFiltered([])
    setTargetUser(0)
  }

  return (
    <div className='compose-container'>
        <div className='compose-input' contentEditable onKeyDown={handleKeyDown} onInput={handleInput}
          suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: input }} ref={inputRef}/>
        <div className='compose-search-container'>
          {filtered.map((user, i) => <span key={user} className={i === targetUser
            ? 'compose-search-target'
            : 'compose-search-item'}>{user}</span>)}
        </div>
    </div>
  )
}
