interface ActionButtonProps {
  text?: string
  callback?: () => void
}

export function ActionButton({ text, callback }: ActionButtonProps) {
  if (text === undefined || callback === undefined) return <></>

  return (
    <button
      onClick={callback}
      className='ml-auto px-5 text-lg font-semibold
      text-primary_base hover:text-primary_darker'
    >
      {text}
    </button>
  )
}
