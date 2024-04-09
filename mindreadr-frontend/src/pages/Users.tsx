import React, { type ReactElement, useState } from 'react'
import { useParams } from 'react-router-dom'

import Feed from '../components/Feed'
import Followers from '../components/Followers'
import Following from '../components/Following'
import TitleBar from '../components/TitleBar'
import UserInfo from '../components/UserInfo'

import useAuth from '../hooks/useAuth'

import { type RawPost } from '../api/getPosts'

export default function Users (): ReactElement {
  const [posts, setPosts] = useState<RawPost[]>([])
  const [selectedTab, setSelectedTab] = useState<string>('followers')

  const params = useParams()
  const user = useAuth()

  const target = params['*'] === '' ? user.username : params['*']
  if (target === undefined) return <></>

  const getTab = (): ReactElement => {
    switch (selectedTab) {
      case 'followers':
        return <Followers target={target}/>
      case 'following':
        return <Following target={target}/>
      default:
        return <Feed posts={posts} setPosts={setPosts} user={target}/>
    }
  }

  // default to posts, toggle to followers/following depending on button
  // make button tabs
  return (
  <div className='h-[90%] flex flex-col w-full'>
    <TitleBar title='Users' btnText='Search' btnCallback={() => {}}/>
    <div className='overflow-y-scroll overflow-x-hidden'>
      <UserInfo username={target} setSelectedTab={setSelectedTab}/>
      {getTab()}
    </div>
  </div>

  )
}
