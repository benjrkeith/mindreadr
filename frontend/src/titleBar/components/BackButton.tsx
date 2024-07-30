interface BackButtonProps {
  callback?: () => void
}

export function BackButton({ callback }: BackButtonProps) {
  if (!callback) return <></>

  return (
    <div className='flex pl-4'>
      <button
        type='button'
        onClick={callback}
        className='my-auto text-2xl text-primary_base 
        hover:text-primary_darker'
      >
        🡰
      </button>
    </div>
  )
}
