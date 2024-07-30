import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Wrapper as AuthWrapper, LogIn, Protected, Register } from 'src/auth'
import { Chats } from 'src/chats'
import { emptyUser, types, userCtx } from 'src/common'
import { WithNav } from 'src/navBar'

import 'src/App.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

export function App() {
  const [user, setUser] = useState<types.User>(emptyUser)

  return (
    <userCtx.Provider value={{ user, setUser }}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to='chats' />} />

            <Route path='auth' element={<AuthWrapper />}>
              <Route path='login' element={<LogIn />} />
              <Route path='register' element={<Register />} />
            </Route>

            <Route path='chats' element={<Protected />}>
              <Route element={<WithNav />}>
                <Route index element={<Chats />} />
              </Route>
            </Route>

            {/* <Route path='chats' element={<Protected />}>
              <Route index element={<Chats />} />
              <Route path='new' element={<CreateChat />} />
              <Route path=':id'>
                <Route index element={<Chat />} />
                <Route path='edit' element={<EditChat />} />
              </Route>
            </Route> */}

            {/* 
              <Route path='users' element={<Protected />}>
                <Route index element={<Navigate to={user.username} />} />

                <Route element={<WithNav />}>
                  <Route path=':username' element={<Profile />} />
                </Route>
              </Route> */}

            {/* 
            <Route path='/notifications' element={<Chats />} />
            <Route path='/trending' element={<Chats />} />
            <Route path='/feed' element={<Chats />} /> */}
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </userCtx.Provider>
  )
}
