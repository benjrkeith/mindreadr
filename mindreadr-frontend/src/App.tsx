import React, { useState, type ReactElement, createContext } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'
import LogIn from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Users from './pages/Users'
import Protected from './components/Protected'

import Auth from './components/Auth'

export interface User {
  username: string
  token: string
  created_at: string
  last_login: string
}

export const API_URL = '/api/'
export const defaultUser: User = { username: '', token: '', created_at: '', last_login: '' }
export const userCtx = createContext(defaultUser)

export default function App (): ReactElement {
  const [user, setUser] = useState(defaultUser)

  return (
    <div className='app-container'>
      <userCtx.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path='/login' element={
              <Auth setUser={setUser} el={<LogIn setUser={setUser}/>}/>
            }/>
            <Route path='/register' element={<Auth setUser={setUser} el={<Register/>}/>}/>
            <Route path='/feed' element={<Protected el={<Feed/>}/>}/>
            <Route path='/users' element={<Protected el={<Users/>}/>}/>
          </Routes>
        </BrowserRouter>
      </userCtx.Provider>
    </div>
  )
}
