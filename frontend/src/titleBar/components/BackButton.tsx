interface BackButtonProps {
  callback?: () => void
}

export function BackButton({ callback }: BackButtonProps) {
  if (!callback) return <></>

  return (
    <button type='button' onClick={callback} className='text-fg1 pl-4 text-4xl'>
      {'\u2B9C'}
    </button>
  )
}
