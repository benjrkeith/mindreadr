import React, { useState, type ReactElement, createContext } from 'react'
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom'
import LogIn from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Users from './pages/Users'
import Protected from './components/Protected'
import Trending from './pages/Trending'

import Auth from './components/Auth'
import Nav from './components/Nav'
// import Compose from './components/Compose'
import './App.css'

export interface User {
  username: string
  token: string
  created_at: string
  last_login: string
  posts?: number
  followers?: number
  following?: number
}

export const API_URL = '/api/'
export const defaultUser: User = { username: '', token: '', created_at: '', last_login: '' }
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
          <Route path='/register' element={<Auth setUser={setUser} el={<Register/>}/>}/>
          <Route path='/feed' element={<Protected el={<Feed/>}/>}/>
          <Route path='/trending' element={<Protected el={<Trending/>}/>}/>
          <Route path='/users/*' element={<Protected el={<Users/>}/>}/>
        </Routes>
        {user.token === '' ? <></> : <Nav/>}
      </BrowserRouter>
    </userCtx.Provider>
  )
}
