import { useEffect, useRef, useState } from 'react'

import { ActionButton } from 'src/titleBar/components/ActionButton'
import { BackButton } from 'src/titleBar/components/BackButton'
import { PopOut } from 'src/titleBar/components/PopOut'
import { Title } from 'src/titleBar/components/Title'

export interface Action {
  text: string
  callback: () => void
}

interface TitleBarProps {
  title: string
  actions?: Action[]
  goBack?: () => void
}

export function TitleBar(props: TitleBarProps) {
  const { title, actions, goBack } = props

  const ref = useRef<HTMLDivElement>(null)
  const [popoutIsHidden, setPopoutIsHidden] = useState(true)

  const togglePopout = () => setPopoutIsHidden((prev) => !prev)

  // Close the popout if the user clicks anywhere else on the page
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        !popoutIsHidden &&
        ref.current &&
        !ref.current.contains(e.target as Node)
      )
        togglePopout()
    }

    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [ref, popoutIsHidden])

  return (
    <div ref={ref} className='z-50 flex flex-col'>
      <div
        className='z-10 flex bg-dark_bg_1dp 
      shadow-[0px_6px_10px] shadow-black/30'
      >
        <BackButton callback={goBack} />
        <Title title={title} />
        {actions && <ActionButton callback={togglePopout} />}
      </div>
      <div className='relative'>
        <PopOut
          actions={actions}
          isHidden={popoutIsHidden}
          toggle={togglePopout}
        />
      </div>
    </div>
  )
}
