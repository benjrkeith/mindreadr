import { ReactNode, useState } from 'react'

import { Controls } from 'src/stepper/components/Controls'
import { Step } from 'src/stepper/components/Step'

interface StepperProps {
  current?: number
  setCurrent?: (value: number) => void
  disableNav?: boolean
  children: ReactNode[]
}

export function Stepper(props: StepperProps) {
  const { disableNav, children } = props

  // used if parent doesn't pass down state
  const [_current, _setCurrent] = useState(0)

  let { current, setCurrent } = props
  if (current === undefined || setCurrent === undefined) {
    current = _current
    setCurrent = _setCurrent
  }

  return (
    <div className='flex grow flex-col overflow-hidden'>
      <div className='grid grow'>
        {children.map((child, i) => (
          <Step key={i} id={i} current={current}>
            {child}
          </Step>
        ))}
      </div>
      <Controls
        total={children.length}
        current={current}
        setCurrent={setCurrent}
        disableNav={disableNav}
      />
    </div>
  )
}
