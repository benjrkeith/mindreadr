import React, { useState, type ReactElement, createContext } from 'react'
import { Route, Routes, BrowserRouter } from 'react-router-dom'

const userCtx = createContext(null)

export default function App (): ReactElement {
  const [user] = useState(null)

  return (
    <div className='app-container'>
      <userCtx.Provider value={user}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<p>hi</p>}/>
          </Routes>
        </BrowserRouter>
      </userCtx.Provider>
    </div>
  )
}
