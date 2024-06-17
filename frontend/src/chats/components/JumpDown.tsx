interface JumpDownProps {
  callback: (bhvr: ScrollBehavior) => void
}

export default function JumpDown({ callback }: JumpDownProps) {
  return (
    <div className='absolute bottom-[5.5rem] w-full text-center'>
      <button
        onClick={() => callback('smooth')}
        className='size-14 rounded-full bg-bg1 text-4xl font-bold 
        hover:bg-fg1'
      >
        {'\u2193'}
      </button>
    </div>
  )
}
