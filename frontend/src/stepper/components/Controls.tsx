interface ControlsProps {
  total: number
  current: number
  disableNav?: Boolean
  setCurrent: (current: number) => void
}

export function Controls(props: ControlsProps) {
  const { total, current, setCurrent } = props

  return (
    <div className='mx-auto flex w-fit gap-1'>
      {[...Array(total).keys()].map((step) => (
        <button
          key={step}
          disabled={Boolean(props.disableNav)}
          onClick={() => {
            setCurrent(step)
          }}
          className={`text-3xl leading-4 ${current === step && 'text-primary'}`}
        >
          •
        </button>
      ))}
    </div>
  )
}
