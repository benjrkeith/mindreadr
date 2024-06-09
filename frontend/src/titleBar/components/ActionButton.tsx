interface ActionButtonProps {
  text: string
  callback?: () => void
}

export function ActionButton({ text, callback }: ActionButtonProps) {
  if (text === '' || callback === undefined) return <></>

  return (
    <button
      onClick={callback}
      className='text-fg1 ml-auto px-5 text-2xl font-semibold'
    >
      {text}
    </button>
  )
}
