import React from 'react'
import { Controls } from './Controls'
import { Step } from './Step'

interface StepperProps {
  children: React.ReactNode[]
}

export function Stepper({ children }: StepperProps) {
  const [current, setCurrent] = React.useState(0)

  return (
    <>
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
      />
    </>
  )
}
