import { ButtonHTMLAttributes } from 'react'
import { cls } from 'src/common/methods'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  sx?: string
}

export function Button(props: ButtonProps) {
  const { sx } = props || ''

  return (
    <button
      {...props}
      className={cls(
        `h-fit w-1/2 max-w-64 rounded-sm 
      py-1 font-semibold uppercase text-primary_base outline outline-2 
      outline-primary_base transition duration-200 ease-out 
      hover:bg-primary_base hover:text-dark_text focus:bg-primary_base 
      focus:text-dark_text 
      disabled:text-dark_bg_lighter disabled:outline-dark_bg_lighter 
      disabled:hover:bg-dark_bg_base disabled:hover:text-dark_bg_lighter`,
        sx,
      )}
    >
      {props.value}
    </button>
  )
}
