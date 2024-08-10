import { useQuery } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { getAllUsernames } from 'src/common'
import { RESOLVED_TAG_RE, getTags } from 'src/feed/methods'

export function NewPost() {
  const [content, setContent] = useState('')
  const [fixedOffset, setFixedOffset] = useState(-1)
  const [selected, setSelected] = useState(0)
  const ref = useRef<HTMLTextAreaElement>(null)

  // get all usernames so we can search through them when tagging a user
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getAllUsernames })

  const tags = useMemo(
    () => getTags(content, usersQuery.data),
    [content, usersQuery.data],
  )

  useEffect(() => {
    if (selected !== 0) setSelected(0)
  }, [tags])

  // when tags are inserted or deleted, fixedOffset is set so that the
  // cursor position can be adjusted before the render
  useLayoutEffect(() => {
    if (fixedOffset !== -1 && ref.current) {
      ref.current.setSelectionRange(fixedOffset, fixedOffset)
      setFixedOffset(-1)
    }
  }, [fixedOffset])

  const getFormattedContent = () => {
    if (content === '')
      return '<span class="opacity-50">What are you thinking...</span>'

    // if there is an unresolved tag, display autocomplete
    let result = content
    if (tags !== undefined) {
      const cn = 'bg-blue-800 px-1 translate-y-full absolute'
      const span = `<span class='${cn}'>${tags.results[selected].username}</span>`

      const offset = tags.match.index
      const before = result.substring(0, offset + 1)
      const after = result.substring(offset + 1)
      result = `${before}${span}${after}`
    }

    // highlight resolved tags
    const resolved = result.match(RESOLVED_TAG_RE)
    if (resolved !== null) {
      for (const match of resolved) {
        const span = `<span spellcheck='false' class='text-primary_base'>${match}</span>`
        result = result.replace(match, span)
      }
    }

    return result
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement
    const offset = target.selectionStart

    switch (e.key) {
      case 'Backspace': {
        if ([' ', ',', '.'].includes(target.value.charAt(offset - 1))) return

        // find which word the user pressed back space in
        let total = 0
        const words = target.value.split(' ')
        const word = words.find((part) => {
          total += part.length + 1
          return total > offset
        })

        if (!word || !word.match(RESOLVED_TAG_RE)) return
        e.preventDefault()

        const idx = words.indexOf(word)
        words[idx - 1] += ' '
        words.splice(idx, 1)

        setContent(words.join(' '))
        setFixedOffset(total - word.length - 1)
        break
      }
      case 'Enter': {
        e.preventDefault()
        if (tags === undefined) return

        const username = tags.results[selected].username
        setContent(content.replace(tags.match[0], `@\u200b${username}`))
        setFixedOffset(offset - tags.match.length + username.length + 1)
        break
      }
      case 'ArrowUp': {
        if (tags === undefined) return
        e.preventDefault()

        if (selected > 0) setSelected(selected - 1)
        break
      }
      case 'ArrowDown': {
        if (tags === undefined) return
        e.preventDefault()

        if (selected < tags.results.length - 1) setSelected(selected + 1)
        break
      }
    }
  }

  return (
    <div className='grid h-full w-full grid-cols-1 grid-rows-1 bg-dark_bg_1dp'>
      <textarea
        ref={ref}
        autoFocus
        spellCheck={false}
        value={content}
        onInput={(e) => setContent(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className='hide-text break-word z-10 col-[1/1] row-[1/1] h-full w-full 
        resize-none bg-transparent'
      />

      <span
        dangerouslySetInnerHTML={{ __html: getFormattedContent() }}
        className='break-word col-[1/1] row-[1/1] h-fit w-full whitespace-pre 
        text-wrap'
      />
    </div>
  )
}
