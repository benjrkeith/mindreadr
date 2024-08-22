import { Link } from 'react-router-dom'

import { Avatar, types } from 'src/common'
import { UNRESOLVED_TAG_RE } from 'src/posts/methods'

interface CommentProps {
  data: types.Comment
}

export function Comment({ data }: CommentProps) {
  return (
    <div className='flex gap-2 p-2'>
      <Avatar user={data.author} sx='size-10 rounded-full' />
      <div className=''>
        <h1 className='text-md leading-5'>{data.author.username}</h1>
        <p className='text-sm'>
          {data.content.split(' ').map((word) => {
            if (word.startsWith('@')) {
              let username = word.replaceAll('\u200b', '')
              const match = username.match(UNRESOLVED_TAG_RE)
              if (match) username = match[0].replace('@', '')
              return (
                <Link
                  key={word}
                  to={`/users/${username}`}
                  className='text-primary_base hover:text-primary_darker'
                >
                  {word}{' '}
                </Link>
              )
            } else return word + ' '
          })}
        </p>
      </div>
    </div>
  )
}
