import { NavBar } from 'src/navBar'
import { TitleBar } from 'src/titleBar'

interface ContentWrapperProps {
  children: JSX.Element
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <div className='bg-bg2 flex h-full flex-col'>
      <TitleBar />
      <div className='flex grow overflow-hidden'>{children}</div>
      <NavBar />
    </div>
  )
}
