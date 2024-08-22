import { useQuery } from '@tanstack/react-query'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { cls, getAllUsernames } from 'src/common'
import { RESOLVED_TAG_RE, getTags } from 'src/posts/methods'

interface EditorProps {
  sx?: string
  placeholder: string
  content: string
  setContent: (content: string) => void
}

export function Editor({ sx, placeholder, content, setContent }: EditorProps) {
  const [fixedOffset, setFixedOffset] = useState(-1)
  const [selected, setSelected] = useState(0)

  const ref = useRef<HTMLTextAreaElement>(null)

  // get all usernames so we can search through them when tagging a user
  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getAllUsernames })

  // gets tag autocompletion data
  let tags = useMemo(
    () => getTags(content, ref.current?.selectionStart, usersQuery.data),
    [content, usersQuery.data],
  )

  // if the list of options change, reset the selection back to the first
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
    if (content === '') return `<span class="opacity-50">${placeholder}</span>`

    // if there is an unresolved tag, display autocomplete
    let result = content
    if (tags !== undefined) {
      const cn = 'absolute opacity-40'
      const span = `<span class='${cn}'>${tags.results[selected].username}</span>`

      const before = result.substring(0, tags.match.index + 1)
      const after = result.substring(tags.match.index + 1)
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
        RESOLVED_TAG_RE.lastIndex = 0
        let resolved = RESOLVED_TAG_RE.exec(target.value)
        while (resolved !== null) {
          if (
            resolved.index < offset &&
            resolved.index + resolved[0].length >= offset
          )
            break
          resolved = RESOLVED_TAG_RE.exec(target.value)
        }

        if (resolved === null) return
        e.preventDefault()

        setContent(target.value.replace(resolved[0], ''))
        setFixedOffset(resolved.index)
        break
      }
      // intentional fall through, but only prevent default if there is a tag
      // @ts-ignore
      case 'Tab':
        if (tags === undefined) return
      case 'Enter': {
        e.preventDefault()
        if (tags === undefined) return

        const username = tags.results[selected].username
        const before = content.substring(0, tags.match.index)
        const after = content.substring(tags.match.index + tags.match[0].length)

        setContent(`${before}@\u200b${username}\u200b${after}`)
        setFixedOffset(tags.match.index + username.length + 3)
        break
      }
      // up and down are for autocompletion when tagging a user
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
      // left and right allow navigating normally without the ZWS interfering
      case 'ArrowLeft': {
        if (ref.current === null) return
        const offset = ref.current.selectionStart

        if (content.charAt(offset - 1) === '\u200b')
          ref.current.setSelectionRange(offset - 1, offset - 1)
        break
      }
      case 'ArrowRight': {
        if (ref.current === null) return
        const offset = ref.current.selectionStart

        if (content.charAt(offset + 1) === '\u200b')
          ref.current.setSelectionRange(offset + 1, offset + 1)
        break
      }
      default: {
        RESOLVED_TAG_RE.lastIndex = 0
        let resolved = RESOLVED_TAG_RE.exec(content)
        while (resolved !== null) {
          if (
            resolved.index < offset &&
            resolved.index + resolved[0].length > offset
          )
            break
          resolved = RESOLVED_TAG_RE.exec(content)
        }

        if (resolved !== null) e.preventDefault()
      }
    }
  }

  return (
    <div className={cls('grid grid-cols-1 grid-rows-1', sx)}>
      <textarea
        ref={ref}
        rows={1}
        autoFocus
        spellCheck={false}
        value={content}
        onInput={(e) => setContent(e.currentTarget.value)}
        onKeyDown={handleKeyDown}
        className='hide-text z-10 col-[1/1] row-[1/1] h-full w-full resize-none 
        break-words bg-transparent outline-none'
      />

      <span
        dangerouslySetInnerHTML={{ __html: getFormattedContent() }}
        className='col-[1/1] row-[1/1] h-full w-full whitespace-pre text-wrap 
        break-words'
      />
    </div>
  )
}
