import { Link, useLocation } from 'react-router-dom'

interface NavButtonProps {
  dest: string
  img: string
}

export function NavButton({ dest, img }: NavButtonProps) {
  const loc = useLocation()

  let className = 'min-h-0 max-h-full object-cover m-auto filter-white'
  if (loc.pathname === dest) className += ' filter-blue'

  return (
    <Link to={dest} className='h-4/6 min-h-0'>
      <img src={img} className={className} />
    </Link>
  )
}
