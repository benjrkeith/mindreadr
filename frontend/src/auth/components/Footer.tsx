import { Link } from 'react-router-dom'

interface FooterProps {
  text: string
  link: {
    text: string
    to: string
  }
}

export function Footer({ text, link }: FooterProps) {
  return (
    <div className='my-2 flex grow'>
      <p className='mx-auto mt-auto text-sm'>
        {text}{' '}
        <Link
          to={link.to}
          className='font-bold text-primary_base hover:text-primary_darker'
        >
          {link.text}
        </Link>
      </p>
    </div>
  )
}
