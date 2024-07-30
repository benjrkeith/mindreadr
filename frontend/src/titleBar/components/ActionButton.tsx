interface ActionButtonProps {
  text?: string
  callback?: () => void
}

export function ActionButton({ text, callback }: ActionButtonProps) {
  if (text === undefined || callback === undefined) return <></>

  return (
    <div className='ml-auto flex px-5'>
      <button
        onClick={callback}
        className='my-auto h-fit text-lg font-semibold
      text-primary_base hover:text-primary_darker'
      >
        {text}
      </button>
    </div>
  )
}
