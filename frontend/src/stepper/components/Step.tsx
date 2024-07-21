interface StepProps {
  id: number
  current: number
  children: React.ReactNode
}

export function Step(props: StepProps) {
  const { id, current, children } = props

  return (
    <div
      className={`col-[1/1] row-[1/1] flex items-center justify-center 
      overflow-hidden transition-all duration-500 ease-out 
      ${id > current && 'translate-x-full'}
      ${id < current && '-translate-x-full'}`}
    >
      {children}
    </div>
  )
}
