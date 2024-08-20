interface JumpUpProps {
  callback: (bhvr: ScrollBehavior) => void
}

export function JumpUp({ callback }: JumpUpProps) {
  return (
    <div className='relative top-6 h-0 w-full text-center'>
      <button
        onClick={() => callback('smooth')}
        className='size-10 rounded-full bg-dark_bg_1dp text-4xl font-bold 
        shadow-[0px_-0px_8px] shadow-black/50 hover:bg-dark_bg_2dp'
      >
        🡱
      </button>
    </div>
  )
}
