import { cls } from 'src/common'

interface InteractionProps {
  img: string
  count: number
  selected: boolean
  callback: () => void
}

export function Interaction({
  img,
  count,
  selected,
  callback,
}: InteractionProps) {
  return (
    <div className='flex justify-center gap-3 px-2 py-[0.35rem]'>
      <button type='button' onClick={callback} className='my-auto'>
        <img
          src={img}
          className={cls('h-4 object-cover hover:opacity-75', {
            invert: !selected,
            'filter-primary': selected,
          })}
        />
      </button>

      {/* <div className='my-auto text-lg leading-3'>•</div> */}

      <button
        type='button'
        className='my-auto text-lg leading-3 hover:opacity-75'
      >
        {count}
      </button>
    </div>
  )
}
