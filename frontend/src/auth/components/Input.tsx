import {
  InputHTMLAttributes,
  RefObject,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

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
  }, [error])

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
        className={`peer rounded-sm bg-dark_bg px-4 pb-2 pt-3 outline 
        outline-2 outline-dark_lighter_bg transition-all duration-300 ease-out 
        hover:outline-dark_text focus:outline-primary
        ${
          error?.message &&
          `outline-secondary_light valid:outline-secondary_light 
           hover:outline-secondary focus:outline-secondary`
        }`}
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute mx-3 mb-2 mt-3 
        bg-dark_bg px-1 text-dark_lighter_bg transition-all duration-100 
        ease-out peer-valid:-translate-y-[1.5rem] peer-valid:text-sm 
        peer-valid:text-dark_text peer-focus:-translate-y-[1.5rem] 
        peer-focus:text-sm peer-focus:text-primary
        ${
          error?.message &&
          `peer-valid:text-secondary_light peer-focus:text-secondary`
        }`}
      >
        {props.label}
      </label>
      <span
        className='p-2 text-xs text-secondary_light 
        transition-all duration-100 ease-out peer-hover:text-secondary 
        peer-focus:text-secondary'
      >
        {error?.message || '\u200B'}
      </span>
    </div>
  )
}
