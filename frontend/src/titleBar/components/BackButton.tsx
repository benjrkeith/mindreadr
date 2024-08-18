interface BackButtonProps {
  callback?: () => void
}

export function BackButton({ callback }: BackButtonProps) {
  if (!callback) return <></>

  return (
    <div className='flex pl-3'>
      <button
        type='button'
        onClick={callback}
        className='my-auto rotate-180 text-3xl leading-6
        text-primary_base hover:text-primary_darker'
      >
        {'\u2794'}
      </button>
    </div>
  )
}
