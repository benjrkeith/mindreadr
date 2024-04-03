import React from 'react'
import TitleBar from '../components/TitleBar'
import UserSearch from '../components/UserSearch'

export default function Trending (): React.ReactElement {
  return (
    <div className=" h-96">
      <TitleBar title='Trending'/>
      <UserSearch/>
    </div>

  )
}
