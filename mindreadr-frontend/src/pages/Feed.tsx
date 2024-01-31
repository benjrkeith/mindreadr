import React, { type ReactElement } from 'react'
import Feed from '../components/Feed'
import Compose from '../components/Compose'

export default function Users (): ReactElement {
  return (
    <>
      <Compose/>
      <Feed user=''></Feed>
      </>)
}
