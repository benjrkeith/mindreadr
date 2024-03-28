import React, { useState, type ReactElement, createContext } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'

import Conversation from './pages/Conversation'
import Feed from './pages/Feed'
import Inbox from './pages/Inbox'
import LogIn from './pages/Login'
import Register from './pages/Register'
import Trending from './pages/Trending'
import Users from './pages/Users'

import Auth from './components/Auth'
import Nav from './components/Nav'
import Protected from './components/Protected'

import './App.css'

export interface User {
  username: string
  token: string
  created_at: string
  last_login: string
  posts?: number
  followers?: number
  following?: number
  avatar: string
}

export const defaultUser: User = {
  username: '',
  token: '',
  created_at: '',
  last_login: '',
  avatar: ''
}
export const userCtx = createContext(defaultUser)

export default function App (): ReactElement {
  const [user, setUser] = useState(defaultUser)

  return (
    <userCtx.Provider value={user}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/feed'/>}/>
          <Route path='/login' element={
            <Auth setUser={setUser} el={<LogIn setUser={setUser}/>}/>
          }/>
          <Route path='/register' element={
            <Auth setUser={setUser} el={<Register/>}/>
          }/>
          <Route path='/feed' element={
            <Protected el={<Feed/>}/>
          }/>
          <Route path='/trending' element={
            <Protected el={<Trending/>}/>
          }/>
          <Route path='/users/*' element={
            <Protected el={<Users/>}/>
          }/>
          <Route path='/inbox' element={
            <Protected el={<Inbox/>}/>
          }/>
          <Route path='/inbox/:conversation' element={
            <Protected el={<Conversation/>}/>
          }/>
        </Routes>
        {user.token === '' ? <></> : <Nav/>}
      </BrowserRouter>
    </userCtx.Provider>
  )
}
