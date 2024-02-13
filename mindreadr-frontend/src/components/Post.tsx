import React, { useState, type ReactElement } from 'react'
import { Link } from 'react-router-dom'

import handleLike from '../api/likePost'
import createRepost from '../api/createRepost'
import { type RawPost } from '../api/getPosts'

import heart from '../../public/heart.png'
import repost from '../../public/repost.png'
import reply from '../../public/reply.png'

interface Props {
  data: RawPost
}

export default function Post (props: Props): ReactElement {
  const {
    key, author, content, parent, parent_author: parentAuthor, reposted, replied, reposts, replies, avatar
  } = props.data

  let { created_at: createdAt } = props.data
  createdAt = new Date(createdAt).toLocaleString()

  const [likes, setLikes] = useState<number>(props.data.likes)
  const [liked, setLiked] = useState<boolean>(props.data.liked)

  return (
    <div className='text-white pt-2 pb-2 ml-2 mr-2 border-t-2 border-solid border-gray-600'>
      <div className='flex flex-col'>
        {/* have parent info be link to parent post */}
        {parent !== null
          ? <p className='pb-2'>Replying to <span className='text-purple-600'>@{parentAuthor}</span></p>
          : null}
        <div className='flex flex-row gap-3'>
          <img src={avatar} alt='' className='rounded-full w-1/5' />
          <div className='grid grid-rows-2'>
            <h1 className='text-purple-600 text-2xl font-semibold h-fit leading-7 self-end'>@{author}</h1>
            <footer className='text-sm leading-4 self-start'>{createdAt}</footer>
          </div>
        </div>
      </div>

      <div className='p-3'>
        {content.split(/(@[\w\d]+)/g).map((word) => word.startsWith('@')
          ? <Link key={word} className='text-purple-600'
            to={`/users/${word.replace('@', '')}`}>{word}</Link>
          : word)}
      </div>

      <div className='grid grid-cols-3'>
        <div className='flex justify-center items-center gap-1'>
          <button className='h-fit' type='submit'
              onClick={async () => { await handleLike(key, liked, setLikes, setLiked) }}>
            <img className={liked
              ? 'filter-purple object-cover h-6 pt-0.5'
              : 'filter-white object-cover h-6 pt-0.5'} src={heart}/>
          </button>
          <p className='text-xl text-center'>•</p>
          <button className='text-xl' type='submit'>{likes}</button>
        </div>
        <div className='flex justify-center items-center gap-1'>
          <button className='h-fit' type='submit' onClick={ async () => { await createRepost(key, reposted, content) }}>
            <img className={reposted
              ? 'filter-purple object-cover h-6 pt-1'
              : 'filter-white object-cover h-6 pt-1'} src={repost}/>
          </button>
          <p className='text-xl text-center'>•</p>
          <button className='text-xl' type='submit'>{reposts}</button>
        </div>
        <div className='flex justify-center items-center gap-1'>
          <button className='h-fit' type='submit'>
            <img className={replied
              ? 'filter-purple object-cover h-6 pt-0.5'
              : 'filter-white object-cover h-6 pt-0.5'} src={reply}/>
          </button>
          <p className='text-xl text-center'>•</p>
          <button className='text-xl' type='submit'>{replies}</button>
        </div>
      </div>
    </div>
  )
}
