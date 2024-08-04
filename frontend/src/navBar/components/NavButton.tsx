import { Link, useLocation } from 'react-router-dom'

import { cls } from 'src/common'

interface NavButtonProps {
  icon: string
  page: string
}

export function NavButton({ icon, page }: NavButtonProps) {
  const location = useLocation()
  const path = location.pathname

  return (
    <Link to={page}>
      <img
        src={icon}
        className={cls('size-8', {
          'filter-primary opacity-100 hover:opacity-70 focus:opacity-70':
            path.includes(page),
          'opacity-80 brightness-0 invert hover:opacity-100 focus:opacity-100':
            !path.includes(page),
        })}
      />
    </Link>
  )
}
