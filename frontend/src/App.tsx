import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { AuthWrapper, LogIn, Protected, Register } from 'src/auth'
import { Chat, Chats, CreateChat, EditChat } from 'src/chats'
import { theme } from 'src/theme'
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
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <CssBaseline enableColorScheme />
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Navigate to={'/chats/1'} />} />

            <Route path='auth' element={<AuthWrapper />}>
              <Route path='login' element={<LogIn />} />
              <Route path='register' element={<Register />} />
            </Route>

            <Route path='/chats'>
              <Route index element={<Protected element={<Chats />} />} />
              <Route
                path='new'
                element={<Protected element={<CreateChat />} />}
              />
              <Route path=':id'>
                <Route index element={<Protected element={<Chat />} />} />
                <Route
                  path='edit'
                  element={<Protected element={<EditChat />} />}
                />
              </Route>
            </Route>

            <Route
              path='/users/*'
              element={<Protected element={<Profile />} />}
            />

            <Route path='/notifications' element={<Chats />} />
            <Route path='/trending' element={<Chats />} />
            <Route path='/feed' element={<Chats />} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
