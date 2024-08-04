import {
  InputHTMLAttributes,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

import { cls } from 'src/common'

// Inputs are expected to be part of a react-hook-form
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  register: UseFormRegister<any>
  error: FieldError | undefined
  _ref?: RefObject<HTMLInputElement>
}

export function Input(props: InputProps) {
  const { label, register, error, ...customProps } = props
  const id = label.toLowerCase()

  // Use custom ref if provided, otherwise use own ref
  const _ref = useRef<HTMLInputElement>(null)
  const inputRef = props._ref || _ref

  const registerProps = register(id, { required: `${label} is empty` })

  // Use custom ref instead of react-hook-form's ref - so we can manually focus
  useImperativeHandle(registerProps.ref, () => inputRef.current)

  // If there is a new error, focus the input
  useLayoutEffect(() => {
    if (error?.message) inputRef.current?.focus()
  }, [error?.message])

  return (
    <div className='mx-auto flex w-2/3 max-w-96 flex-col'>
      <input
        {...customProps}
        {...registerProps}
        ref={inputRef}
        id={id}
        spellCheck='false'
        required
        autoComplete='off'
        className={cls(
          `hover:outline-dark_text peer rounded-sm bg-dark_bg_base px-4 pb-2 pt-3 outline 
          outline-2 outline-dark_bg_lighter transition-all duration-300 
          ease-out focus:outline-primary_base`,
          {
            'outline-error focus:outline-error hover:outline-error':
              error?.message,
          },
        )}
      />
      <label
        htmlFor={id}
        className={cls(
          `peer-valid:text-dark_text_bas peer-hover:text-dark_text pointer-events-none absolute mx-3 
           mb-2 mt-3 bg-dark_bg_base px-1 text-dark_bg_lighter 
           transition-all duration-100 ease-out 
           peer-valid:-translate-y-[1.5rem] peer-valid:text-sm 
           peer-focus:-translate-y-[1.5rem] peer-focus:text-sm 
           peer-focus:text-primary_base`,
          {
            'peer-valid:text-error peer-focus:text-error peer-hover:text-error':
              error?.message,
          },
        )}
      >
        {props.label}
      </label>
      <span className='text-error p-2 text-xs'>
        {error?.message || '\u200B'}
      </span>
    </div>
  )
}

{
  /* <input
{...customProps}
{...registerProps}
ref={inputRef}
id={id}
spellCheck='false'
required
autoComplete='off'
className={`peer rounded-sm 
bg-dark_bg_base px-4 pb-2 pt-3 outline 
outline-2 outline-dark_bg_lighter transition-all duration-300 ease-out 
hover:outline-dark_text focus:outline-primary_base
${
  error?.message &&
  `outline-error hover:outline-error focus:outline-error`
}`}
/> */
}

// <label
// htmlFor={id}
// className={`peer-valid:text-dark_text_bas pointer-events-none absolute
// mx-3 mb-2 mt-3 bg-dark_bg_base px-1 text-dark_bg_lighter
// transition-all duration-100 ease-out peer-valid:-translate-y-[1.5rem]
// peer-valid:text-sm peer-hover:text-dark_text
// peer-focus:-translate-y-[1.5rem] peer-focus:text-sm
// peer-focus:text-primary_base
// ${
//   error?.message &&
//   `peer-valid:text-error peer-focus:text-error
//    peer-hover:text-error`
// }`}
// >
