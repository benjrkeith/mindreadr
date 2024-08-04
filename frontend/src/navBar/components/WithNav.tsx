import { Outlet } from 'react-router-dom'

import { NavBar } from 'src/navBar/components/NavBar'

export function WithNav() {
  return (
    <>
      <Outlet />
      <NavBar />
    </>
  )
}
