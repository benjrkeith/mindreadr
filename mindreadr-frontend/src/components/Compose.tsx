import React, { useState, type ReactElement, useEffect, useCallback, useLayoutEffect } from 'react'

import { getAllUsernames } from '../api/getAllUsernames'
import createPost from '../api/createPost'
import { type RawPost } from '../api/getPosts'

interface Props {
  posts: RawPost[]
  setPosts: React.Dispatch<React.SetStateAction<RawPost[]>>
  setCreatePost: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Compose (props: Props): ReactElement {
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
  }, [offset])

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

    // when pressing backspace on tag, delete whole tag
    if (textInput.innerText.length >= 140 && e.key !== 'Backspace') {
      // display error char limit reached
      e.preventDefault()
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (targetUser < 4) setTargetUser(prev => prev + 1)
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

    newInput = newInput.replace(re, ` <span class='text-purple-600'>@${filtered[targetUser]}</span>\u200B`)
    setInput(newInput)
    setOffset(prev => prev + filtered[targetUser].length - match[0].length + 4)
    setFiltered([])
    setTargetUser(0)
  }

  async function handleSubmit (e: React.FormEvent): Promise<void> {
    e.preventDefault()

    const content = inputRef.current?.innerText
    if (content === undefined || content === '') return

    const post: RawPost = await createPost(content)
    post.likes = 0
    props.setPosts(prev => [post, ...prev])

    setInput('')
    setFiltered([])
    props.setCreatePost(false)
  }

  return (
    <div className='absolute h-dvh w-dvw bg-[#1e2124] z-10'>
      <div className='flex h-[10dvh] items-center border-b-2 border-solid border-white ml-4 mr-4'>
        <button type="button" onClick={() => { props.setCreatePost(false) }} className='text-red-700 text-3xl p-3 col-[1] text-left font-semibold'>X</button>
        <p className='col-[2] grow text-right text-white p-3 align-middle justify-center font-semibold'>{inputRef.current?.innerText.length}/140</p>
      </div>
      <div className='p-5 text-white' contentEditable onKeyDown={handleKeyDown} onInput={handleInput}
        suppressContentEditableWarning dangerouslySetInnerHTML={{ __html: input }} ref={inputRef}/>
      {filtered.length > 0 && <div className='bg-white flex flex-col w-fit m-auto'>
        {filtered.slice(0, 5).map((user, i) => <span key={user} className={i === targetUser
          ? 'bg-purple-600 text-white w-fit p-1'
          : 'w-fit p-1'}>{user}</span>)}
      </div>}
      {/* length doesn't update if u tag someone until you type another char */}
      <div className='h-[20dvh] absolute top-[80%] w-[90%] left-[5%] flex border-t-2 border-solid border-white'>
        <button type="button" onClick={handleSubmit} className='bg-purple-600 text-white m-7 w-full rounded-full
          font-bold text-2xl'>Submit</button>
      </div>
    </div>
  )
}
