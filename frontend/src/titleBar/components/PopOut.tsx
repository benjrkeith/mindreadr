import { cls } from 'src/common'
import { Action } from 'src/titleBar/components/TitleBar'

interface PopOutProps {
  actions?: Action[]
  isHidden: boolean
  toggle: () => void
}

export function PopOut({ actions, toggle, isHidden }: PopOutProps) {
  if (!actions) return <></>

  return (
    <div
      className={cls(
        `absolute right-0 z-0 m-1 flex flex-col rounded-md 
        bg-dark_bg_1dp p-2 shadow-[0px_0px_12px] shadow-black/50 
        transition-all duration-100 ease-out`,
        {
          'opacity-0': isHidden,
        },
      )}
    >
      {actions.map((action) => (
        <button
          key={action.text}
          onClick={() => {
            toggle()
            action.callback()
          }}
          className='ml-auto w-fit rounded-md px-2 py-1 text-sm font-medium 
          hover:bg-dark_bg_2dp'
        >
          {action.text}
        </button>
      ))}
    </div>
  )
}
