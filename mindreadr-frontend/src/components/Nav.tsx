import React, { type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

import feed from '../assets/feed.png'
import inbox from '../assets/inbox.png'
import trending from '../assets/trends.png'
import users from '../assets/users.png'

export default function Nav (): ReactElement {
  const loc = useLocation()

  return (
    <div className='grid grid-cols-4 items-center h-[9%] w-full
    box-border bg-zinc-900 border-zinc-800 border-solid rounded-t-xl border-t-[2px]'>

      <Link to='/feed' className='min-h-0 h-4/6'>
        <img src={feed} alt='' className={`min-h-0 max-h-full object-cover m-auto
          ${loc.pathname === '/feed' ? 'filter-purple' : 'filter-white '}`} />
      </Link>

      <Link to='/trending' className='min-h-0 h-4/6'>
        <img src={trending} alt='' className={`min-h-0 max-h-full object-cover m-auto
          ${loc.pathname === '/trending' ? 'filter-purple' : 'filter-white '}`} />
      </Link>

      <Link to='/inbox' className='min-h-0 h-4/6'>
        <img src={inbox} alt='' className={`min-h-0 max-h-full object-cover m-auto
          ${loc.pathname === '/inbox' ? 'filter-purple' : 'filter-white '}`} />
      </Link>

      <Link to='/users' className='min-h-0 h-4/6'>
        <img src={users} alt='' className={`min-h-0 max-h-full object-cover m-auto
          ${loc.pathname === '/users' ? 'filter-purple' : 'filter-white '}`} />
      </Link>
    </div>
  )
}
