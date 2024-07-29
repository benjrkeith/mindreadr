interface BackButtonProps {
  callback?: () => void
}

export function BackButton({ callback }: BackButtonProps) {
  if (!callback) return <></>

  return (
    <button
      type='button'
      onClick={callback}
      className='pl-4 text-2xl text-primary_base hover:text-primary_darker'
    >
      🡰
    </button>
  )
}
