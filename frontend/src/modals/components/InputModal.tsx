import { useRef } from 'react'
import { BaseModal } from 'src/modals/components/BaseModal'
import { useModalStore } from 'src/store'

export function InputModal() {
  const inputRef = useRef<HTMLInputElement>(null)
  const { label, setModal, callback } = useModalStore()

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') () => setModal({ type: undefined })
    else if (e.key === 'Enter') callback(inputRef.current?.value)
  }

  return (
    <BaseModal>
      <label htmlFor='nameInput' className='w-fit text-lg font-medium'>
        {label}
      </label>
      <input
        id='nameInput'
        ref={inputRef}
        autoFocus
        onKeyDown={onKeyDown}
        className='w-full rounded-lg border-2 border-none
          bg-fg2 p-2 text-2xl text-bg1 outline-none focus:outline-fg1'
        type='text'
      />
      <button
        type='button'
        onClick={() => callback(inputRef.current?.value)}
        className='mx-auto mt-auto w-4/6 rounded-xl bg-fg1 p-1 text-xl 
          font-semibold'
      >
        Submit
      </button>
    </BaseModal>
  )
}
