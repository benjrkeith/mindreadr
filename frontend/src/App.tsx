import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Wrapper as AuthWrapper, LogIn, Protected, Register } from 'src/auth'
import { Chat, Chats, NewChat } from 'src/chats'
import { emptyUser, types, userCtx } from 'src/common'
import { WithNav } from 'src/navBar'
import { Profile } from 'src/users'

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

              <Route path='new' element={<NewChat />} />
              <Route path=':id' element={<Chat />} />
            </Route>

            <Route path='users' element={<Protected />}>
              <Route element={<WithNav />}>
                <Route
                  index
                  element={<Navigate to={`/users/${user.username}`} />}
                />
                <Route path=':username' element={<Profile />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </userCtx.Provider>
  )
}
