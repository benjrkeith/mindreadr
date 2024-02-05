import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

export default function Nav (): ReactElement {
  return (
    <div className='grid grid-cols-4 justify-items-center h-[10%] box-border border-t-2 border-white
          border-double w-full p-2'>
        <Link to='/feed' className='min-h-0 h-full'>
          <img src='home.png' alt='' className='min-h-0 max-h-full object-cover filter-white' />
        </Link>
        <Link to='/trending' className='min-h-0 h-full'>
          <img src='trends.png' alt='' className='min-h-0 max-h-full object-cover filter-white' />
        </Link>
        <Link to='/users' className='min-h-0 h-full'>
          <img src='users.png' alt='' className='min-h-0 max-h-full object-cover filter-white' />
        </Link>
        <Link to='/users' className='min-h-0 h-full'>
          <img src='settings.png' alt='' className='min-h-0 max-h-full object-cover filter-white' />
        </Link>
    </div>
  )
}
