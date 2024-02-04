import React, { type ReactElement } from 'react'
import { Link } from 'react-router-dom'

import './Nav.css'

export default function Nav (): ReactElement {
  return (
    <div id='nav'>
        <Link to='/feed' className='nav-link'><img src='home.png' alt='' className='nav-img' /></Link>
        <Link to='/trending' className='nav-link'><img src='trends.png' alt='' className='nav-img' /></Link>
        <Link to='/users' className='nav-link'><img src='users.png' alt='' className='nav-img' /></Link>
        <Link to='/users' className='nav-link'><img src='settings.png' alt='' className='nav-img' /></Link>
    </div>
  )
}
