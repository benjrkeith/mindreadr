interface BackButtonProps {
  callback?: () => void
}

export function BackButton({ callback }: BackButtonProps) {
  if (!callback) return <></>

  return (
    <button
      type='button'
      onClick={callback}
      className='hover:text-fg3 pl-4 text-4xl text-fg1 '
    >
      {'\u2B9C'}
    </button>
  )
}
