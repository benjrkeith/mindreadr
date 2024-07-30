import { icons } from 'src/navBar/assets'
import { NavButton } from 'src/navBar/components/NavButton'

export function NavBar() {
  return (
    <div
      className='bg-dark_bg_1dp flex justify-around rounded-t-2xl px-1 pb-2 
      pt-3 shadow-[0px_-10px_8px] shadow-black/10'
    >
      <NavButton page='/notifications' icon={icons.notifications} />
      <NavButton page='/trending' icon={icons.trending} />
      <NavButton page='/home' icon={icons.home} />
      <NavButton page='/chats' icon={icons.chats} />
      <NavButton page='/users' icon={icons.users} />
    </div>
  )
}
