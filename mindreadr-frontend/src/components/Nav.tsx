import React from 'react'
import { Link } from 'react-router-dom'

export default function Nav () {
  return (
    <div className='nav-container'>
        <Link to='/feed' className='nav-link'>Feed</Link>
        <Link to='/trending' className='nav-link'>Trending</Link>
        <Link to='/users' className='nav-link'>Users</Link>
    </div>
  )
}
