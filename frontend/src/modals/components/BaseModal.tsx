import { useModalStore } from 'src/store'

interface BaseModalProps {
  children: JSX.Element[]
}

export function BaseModal({ children }: BaseModalProps) {
  const { setModal } = useModalStore()

  return (
    <div
      onClick={() => setModal({ type: undefined })}
      className='absolute z-50 flex h-full w-full backdrop-blur-sm'
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className='mx-auto my-auto box-border flex h-fit w-full max-w-80 
        flex-col gap-2 rounded-xl bg-bg1 p-8'
      >
        {children}
      </div>
    </div>
  )
}
