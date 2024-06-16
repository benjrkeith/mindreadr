import { BaseModal } from 'src/modals/components/BaseModal'
import { useModalStore } from 'src/store'

export function ConfirmModal() {
  const { label, setModal, callback } = useModalStore()

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') setModal({ type: undefined })
    else if (e.key === 'Enter') callback(undefined)
  }

  return (
    <BaseModal>
      <h1 className='w-full text-center text-lg'>{label}</h1>
      <div className='grid grid-cols-2 pt-4'>
        <button
          type='button'
          onClick={() => setModal({ type: undefined })}
          className='mx-auto mt-auto w-4/6 rounded-xl bg-red-600 p-2 text-xl 
          font-semibold'
        >
          Cancel
        </button>
        <button
          autoFocus
          onKeyDown={onKeyDown}
          type='button'
          onClick={callback}
          className='mx-auto mt-auto w-4/6 rounded-xl bg-fg1 p-2 text-xl 
          font-semibold'
        >
          Submit
        </button>
      </div>
    </BaseModal>
  )
}
