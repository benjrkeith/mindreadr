import React, { type ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav (): ReactElement {
  const loc = useLocation()

  return (
    <div className='grid grid-cols-4 justify-items-center items-center h-[10%] box-border border-t-2 border-white
          border-double w-full p-2'>
        <Link to='/feed' className='min-h-0 h-4/6'>
          <img src='home.png' alt='' className={`min-h-0 max-h-full object-cover filter-white 
            ${loc.pathname === '/feed' ? 'filter-purple' : ''}`} />
        </Link>
        <Link to='/trending' className='min-h-0 h-4/6'>
          <img src='trends.png' alt='' className={`min-h-0 max-h-full object-cover filter-white 
            ${loc.pathname === '/trending' ? 'filter-purple' : ''}`} />
        </Link>
        <Link to='/users' className='min-h-0 h-4/6'>
          <img src='users.png' alt='' className={`min-h-0 max-h-full object-cover filter-white 
            ${loc.pathname === '/users' ? 'filter-purple' : ''}`} />
        </Link>
        <Link to='/inbox' className='min-h-0 h-4/6'>
          <img src='settings.png' alt='' className={`min-h-0 max-h-full object-cover filter-white 
            ${loc.pathname === '/inbox' ? 'filter-purple' : ''}`} />
        </Link>
    </div>
  )
}
