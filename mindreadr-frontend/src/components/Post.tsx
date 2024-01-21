/* eslint-disable @typescript-eslint/naming-convention */
import React, { type ReactElement } from 'react'

import { type RawPost } from '../api/getPosts'
import './Post.css'

interface Props {
  data: RawPost
}

export default function Post (props: Props): ReactElement {
  const {
    author, content, created_at, likes, liked, parent,
    parent_author, reposted, replied
  } = props.data
  const createdAt = new Date(created_at).toUTCString()

  return (
    <div className='post-container'>

      <div className='post-info-container'>
        {/* have parent info be link to parent post */}
        {parent !== null
          ? <p className='post-info-parent'>Replying to @{parent_author}</p>
          : null}
        <div className="post-info-outer-container">
          <img src='default-avatar.png' alt="" className="post-info-avatar" />
          <div className="post-info-inner-container">
            <h1 className='post-info-author'>@{author}</h1>
            <footer className='post-info-date'>{createdAt}</footer>
          </div>
        </div>
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
            <img className={reposted
              ? 'post-action-img-true'
              : 'post-action-img-false'} src='repost.png'/>
          </button>
          <p className='post-action-separator'>•</p>
          <button className='post-action'type='submit'>{likes}</button>
        </div>
        <div className='post-action-container'>
          <button className='post-action' type='submit'>
            <img className={replied
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
