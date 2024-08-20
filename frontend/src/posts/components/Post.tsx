import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

import { useAuth } from 'src/auth'
import { Avatar, getDateString } from 'src/common'
import { PostResponse, toggleLike } from 'src/posts/api'
import { assets } from 'src/posts/assets'
import { Interaction } from 'src/posts/components/Interaction'

interface PostProps {
  data: PostResponse
}

export function Post({ data }: PostProps) {
  const { likes, comments } = data._count
  const date = new Date(data.createdAt)

  const { user } = useAuth()
  const queryClient = useQueryClient()

  const likeMutation = useMutation({
    mutationFn: () => toggleLike(data.id, isLiked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })

  const isLiked = data.likes.some((like) => like.userId === user.id)

  return (
    <div
      className='z-10 m-2 my-1 flex flex-col gap-1 rounded-lg bg-dark_bg_1dp
      shadow-[0px_0px_20px] shadow-black/20'
    >
      <div className='flex gap-2 p-2'>
        <Avatar user={data.author} sx='size-12 rounded-full' />

        <div className='flex w-full flex-col gap-1'>
          <div className='flex w-full'>
            <Link
              to={`/users/${data.author.username}`}
              className='text-xl font-semibold leading-7 hover:text-primary_base'
            >
              {data.author.username}
            </Link>

            <span className='my-auto ml-auto h-fit text-xs'>
              {getDateString(date)}
            </span>
          </div>

          <p className='text-xs'>
            {data.content.split(' ').map((word) => {
              if (word.startsWith('@'))
                return (
                  <Link
                    key={word}
                    to={`/users/${word.substring(1).replaceAll('\u200b', '')}`}
                    className='text-primary_base hover:text-primary_darker'
                  >
                    {word}{' '}
                  </Link>
                )
              else return word + ' '
            })}
          </p>
        </div>
      </div>

      <div className='flex w-full justify-evenly rounded-lg pb-1 '>
        <Interaction
          img={assets.heart}
          count={likes}
          selected={isLiked}
          callback={() => likeMutation.mutate()}
        />
        <Interaction
          img={assets.share}
          count={comments}
          selected={data.comments.length > 0}
          callback={() => {}}
        />
      </div>
    </div>
  )
}
