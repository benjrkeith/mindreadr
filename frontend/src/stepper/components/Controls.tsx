interface ControlsProps {
  total: number
  current: number
  disableNav?: Boolean
  setCurrent: (current: number) => void
}

export function Controls(props: ControlsProps) {
  const { total, current, setCurrent, disableNav } = props

  if (disableNav) return <></>

  return (
    <div className='mx-auto flex w-fit gap-1'>
      {[...Array(total).keys()].map((step) => (
        <button
          key={step}
          tabIndex={-1}
          onClick={() => {
            setCurrent(step)
          }}
          className={`text-3xl leading-4 
          ${current === step && 'text-primary'}`}
        >
          •
        </button>
      ))}
    </div>
  )
}
