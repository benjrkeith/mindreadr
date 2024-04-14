import React, { useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'

import createRepost from '../api/createRepost'
import handleLike from '../api/likePost'
import { type RawPost } from '../api/getPosts'

import heart from '../assets/heart.png'
import reply from '../assets/reply.png'
import repost from '../assets/repost.png'

interface Props {
  i: number
  data: RawPost
}

export default function Post ({ i, data }: Props): ReactElement {
  let createdAt = new Date(data.created_at).toLocaleString()
  createdAt = createdAt.slice(0, createdAt.length - 3)
  const {
    key, author, content, parent, parent_author: parentAuthor, reposted,
    replied, reposts, replies, author_avatar: authorAvatar
  } = data

  const [liked, setLiked] = useState<boolean>(data.liked)
  const likes = liked ? data.likes + 1 : data.likes
  console.log(data.key)

  return (
    <div className={`text-white p-3 rounded-lg sm:px-5 md:px-8 ${i % 2 === 0 && 'bg-zinc-900'}`}>
      <div className='flex flex-col'>
        {/* have parent info be link to parent post */}
        {/* {parent !== null
          ? <p className='pb-2'>Replying to <span className='text-purple-600'>@{parentAuthor}</span></p>
          : null} */}
        <div className='flex flex-row gap-2 sm:gap-4'>
          <img src={`data:image/jpeg;base64,${authorAvatar}`} alt='' className='rounded-lg w-[20%] aspect-square
            ' />
          <div className='flex flex-col justify-center grow'>
            <Link className='text-purple-600 text-lg font-semibold h-fit
                leading-6 sm:text-2xl' to={`/users/${author}`}>
              @{author}
            </Link>
            <footer className='text-[0.6rem] leading-3 self-start grow
                sm:text-sm'>
              {createdAt}
            </footer>
          </div>
          <button className='pr-5'>
            <div className='leading-[0.4rem]'>•</div>
            <div className='leading-[0.4rem]'>•</div>
            <div className='leading-[0.4rem]'>•</div>
          </button>
        </div>
      </div>

      <div className='px-1 py-2 text-sm sm:py-3 sm:text-lg md:py-4 md:text-2xl'>
        {content.split(/(@[\w\d]+)/g).map((word) => word.startsWith('@')
          ? <Link key={word} to={`/users/${word.replace('@', '')}`}
              className='text-purple-600 font-semibold text-sm sm:text-lg
              md:text-2xl'>{word}</Link>
          : word)}
      </div>

      <div className='grid grid-cols-3 max-w-96 mx-auto'>
        <div className='flex justify-center gap-1'>
          <button className='h-fit' type='submit' onClick={async () => {
            await handleLike(key, liked, setLiked)
          }}>
            <img src={heart} className={liked
              ? 'filter-purple object-cover h-3 sm:h-5'
              : 'filter-white object-cover h-3 sm:h-5'}/>
          </button>
          <div className='text-lg self-center leading-3 sm:text-2xl sm:leading-3'>•</div>
          <button className='leading-3 h-fit sm:text-xl sm:leading-5' type='submit'>
            {likes}
          </button>
        </div>
        <div className='flex justify-center gap-1'>
          <button className='h-fit' type='submit' onClick={ async () => {
            await createRepost(key, reposted, content)
          }}>
            <img className={reposted
              ? 'filter-purple object-cover h-3 sm:h-5'
              : 'filter-white object-cover h-3 sm:h-5'} src={repost}/>
          </button>
          <div className='text-lg self-center leading-3 sm:text-2xl sm:leading-3'>•</div>
          <button className='leading-3 h-fit sm:text-xl sm:leading-5' type='submit'>
            {reposts}
          </button>
        </div>
        <div className='flex justify-center items-center gap-1'>
          <button className='h-fit' type='submit'>
            <img className={replied
              ? 'filter-purple object-cover h-3 sm:h-5'
              : 'filter-white object-cover h-3 sm:h-5'} src={reply}/>
          </button>
          <div className='text-lg self-center leading-3 sm:text-2xl sm:leading-3'>•</div>
          <button className='leading-3 h-fit sm:text-xl sm:leading-5' type='submit'>
            {replies}
          </button>
        </div>
      </div>
    </div>
  )
}
