import { chats, feed, notifications, trending, users } from 'src/navBar/assets'
import { NavButton } from 'src/navBar/components/NavButton'
import { useNavStore } from 'src/store'

export function NavBar() {
  const { isHidden } = useNavStore()

  return (
    !isHidden && (
      <div
        className='border-bg2 bg-bg1 box-border grid h-[9%] w-full 
      grid-cols-5 items-center rounded-t-xl border-t-[2px] border-solid'
      >
        <NavButton img={notifications} dest='/notifications' />
        <NavButton img={trending} dest='/trending' />
        <NavButton img={feed} dest='/feed' />
        <NavButton img={chats} dest='/chats' />
        <NavButton img={users} dest='/users' />
      </div>
    )
  )
}
