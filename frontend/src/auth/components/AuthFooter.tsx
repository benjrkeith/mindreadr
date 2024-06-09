import { Link } from 'react-router-dom'

interface FooterProps {
  text: string
  linkText: string
  linkPath: string
}

export function AuthFooter({ text, linkText, linkPath }: FooterProps) {
  return (
    <div
      className='mx-auto mb-2 flex w-full grow-[1] items-end justify-evenly
    sm:mb-5 lg:items-start'
    >
      <p className='text-sm text-white sm:text-xl'>
        {text}
        <Link to={linkPath} className='text-fg1 text-base sm:text-2xl'>
          {' '}
          {linkText}
        </Link>
      </p>
    </div>
  )
}
