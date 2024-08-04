import { dark_logo, light_logo } from 'src/auth/assets'

export function Logo() {
  return (
    <>
      <img
        src={dark_logo}
        alt='logo'
        className='mx-auto mt-4 hidden size-32 dark:flex'
      />
      <img
        src={light_logo}
        alt='logo'
        className='mx-auto mt-4 size-32 dark:hidden'
      />
    </>
  )
}
