import React, { type ReactElement } from 'react'

import { type RawPost } from '../api/getPosts'

interface Props {
  data: RawPost
}

export default function Post (props: Props): ReactElement {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { author, content, created_at, likes, liked } = props.data
  const parent = 2
  const createdAt = new Date(created_at).toUTCString()

  return (
    <div className='post-container'>

      <div className='post-info-container'>
        {parent !== null ? <p className='post-info-parent'>Replying to @{parent}</p> : null}
        <img src='default-avatar.png' alt="" className="post-info-avatar" />
        <h2 className='post-info-author'>@{author}</h2>
        <footer className='post-info-date'>{createdAt}</footer>
      </div>

      <p className='post-content'>{content}</p>

      <div className='post-actions-container'>
        <div className='post-action-container'>
          <button className='post-action' type='submit'>
            <img className={liked
              ? 'post-action-img-true'
              : 'post-action-img-false'} src='heart.png'/>
          </button>
          <p className='post-action-separator'>•</p>
          <button className='post-action' type='submit'>{likes}</button>
        </div>
        <div className='post-action-container'>
          <button className='post-action' type='submit'>
            {/* need to add backend func for checking if user has replied or retweeted */}
            <img className={liked
              ? 'post-action-img-true'
              : 'post-action-img-false'} src='repost.png'/>
          </button>
          <p className='post-action-separator'>•</p>
          <button className='post-action'type='submit'>{likes}</button>
        </div>
        <div className='post-action-container'>
          <button className='post-action' type='submit'>
            <img className={liked
              ? 'post-action-img-true'
              : 'post-action-img-false'} src='reply.png'/>
          </button>
          <p className='post-action-separator'>•</p>
          <button className='post-action' type='submit'>{likes}</button>
        </div>
      </div>

      {/* {showLikes
        ? <div className='post-interactions-container'>
        {usersLiked.map((user) => <li className='' key={user}>{user}</li>)}
      </div>
        : null} */}
    </div>
  )
}
