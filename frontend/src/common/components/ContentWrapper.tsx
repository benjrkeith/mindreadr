import { MultiModal } from 'src/modals'
import { NavBar } from 'src/navBar'
import { useModalStore } from 'src/store'
import { TitleBar } from 'src/titleBar'

interface ContentWrapperProps {
  children: JSX.Element
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  const modalStore = useModalStore()

  return (
    <>
      {modalStore.type && <MultiModal />}
      <div
        className='flex h-full w-full flex-col bg-fg2 text-bg2 
      dark:bg-bg2 dark:text-fg2'
      >
        <TitleBar />
        <div className='flex grow overflow-hidden'>{children}</div>
        <NavBar />
      </div>
    </>
  )
}
