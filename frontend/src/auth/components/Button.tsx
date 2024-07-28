import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className='h-fit w-1/2 max-w-64 rounded-sm py-1 font-semibold uppercase 
      text-primary outline outline-2 outline-primary transition duration-200 
      ease-out hover:bg-primary hover:text-dark_text focus:bg-primary 
      focus:text-dark_text disabled:text-dark_lighter_bg 
      disabled:outline-dark_lighter_bg disabled:hover:bg-dark_bg 
      disabled:hover:text-dark_lighter_bg'
    >
      {props.value}
    </button>
  )
}
