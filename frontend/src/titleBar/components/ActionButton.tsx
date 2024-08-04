interface ActionButtonProps {
  callback: () => void
}

export function ActionButton({ callback }: ActionButtonProps) {
  return (
    <div className='ml-auto flex px-5'>
      <button
        onClick={callback}
        className='my-auto h-fit text-xl font-bold
      text-primary_base hover:text-primary_darker'
      >
        {'\u22EE'}
      </button>
    </div>
  )
}
