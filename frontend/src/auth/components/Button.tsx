import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
}

export function Button(props: ButtonProps) {
  return (
    <button
      {...props}
      className='focus:text-dark_text hover:text-dark_text h-fit w-1/2 
      max-w-64 rounded-sm py-1 font-semibold uppercase text-primary_base 
      outline outline-2 outline-primary_base transition duration-200 ease-out
      hover:bg-primary_base focus:bg-primary_base 
      disabled:text-dark_bg_lighter disabled:outline-dark_bg_lighter 
      disabled:hover:bg-dark_bg_base disabled:hover:text-dark_bg_lighter'
    >
      {props.value}
    </button>
  )
}
