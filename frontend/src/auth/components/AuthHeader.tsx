export function AuthHeader({ title }: { title: string }) {
  return (
    <div className='flex grow-[1] items-end'>
      <h1 className='justify-end text-5xl font-bold italic sm:text-7xl'>
        {title}
      </h1>
    </div>
  )
}
