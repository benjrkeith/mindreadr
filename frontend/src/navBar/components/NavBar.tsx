import { Link, useLocation } from 'react-router-dom'

import { icons } from 'src/navBar/assets'

function getClass(path: string, page: string) {
  return path.includes(page) ? 'filter-primary' : 'filter-lighter'
}
// ${getClass(path, 'notifications')}
export function NavBar() {
  const location = useLocation()
  const path = location.pathname

  return (
    <div
      className='border-dark_bg_lighter flex justify-evenly gap-3 rounded-t-2xl 
      border-t-2 p-2 pt-3'
    >
      <Link to='/notifications'>
        <img
          src={icons.notifications}
          className={`size-9 ${getClass(path, 'notifications')}`}
        />
      </Link>
      <Link to='/trending'>
        <img
          src={icons.trending}
          className={`size-9 ${getClass(path, 'trending')}`}
        />
      </Link>
      <Link to='/home'>
        <img src={icons.home} className={`size-9 ${getClass(path, 'home')}`} />
      </Link>
      <Link to='/chats'>
        <img
          src={icons.chats}
          className={`size-9 ${getClass(path, 'chats')}`}
        />
      </Link>
      <Link to='/users'>
        <img
          src={icons.users}
          className={`size-9 ${getClass(path, 'users')}`}
        />
      </Link>
    </div>
  )
}
