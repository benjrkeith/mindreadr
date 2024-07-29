interface TitleProps {
  title: string
}

export function Title({ title }: TitleProps) {
  return (
    <h1 className='truncate py-3 pl-4 text-2xl font-semibold leading-7'>
      {title}
    </h1>
  )
}
