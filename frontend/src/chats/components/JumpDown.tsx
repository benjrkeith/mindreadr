interface JumpDownProps {
  callback: (bhvr: ScrollBehavior) => void
}

export default function JumpDown({ callback }: JumpDownProps) {
  return (
    <div className='absolute bottom-[5.5rem] w-full text-center'>
      <button
        onClick={() => callback('smooth')}
        className='size-14 rounded-full bg-zinc-950 text-4xl font-bold'
      >
        {'\u2193'}
      </button>
    </div>
  )
}
