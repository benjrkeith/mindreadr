import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { Auth, AuthWrapper, Protected } from 'src/auth'
import { Chat, Chats, CreateChat } from 'src/chats'
import { ContentWrapper } from 'src/common'
import 'src/main.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ContentWrapper>
          <Routes>
            <Route path='/' element={<Navigate to={'/chats/1'} />} />

            <Route
              path='/auth/*'
              element={
                <AuthWrapper>
                  <Auth />
                </AuthWrapper>
              }
            />

            <Route path='/chats'>
              <Route index element={<Protected element={<Chats />} />} />
              <Route
                path='new'
                element={<Protected element={<CreateChat />} />}
              />
              <Route path=':id' element={<Protected element={<Chat />} />} />
            </Route>

            <Route path='/notifications' element={<Chats />} />
            <Route path='/trending' element={<Chats />} />
            <Route path='/feed' element={<Chats />} />
            <Route path='/users' element={<Chats />} />
          </Routes>
        </ContentWrapper>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
