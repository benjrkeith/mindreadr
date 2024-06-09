interface TitleProps {
  title: string
}

export function Title({ title }: TitleProps) {
  return <h1 className='my-2 truncate py-2 pl-4 text-4xl font-bold'>{title}</h1>
}
