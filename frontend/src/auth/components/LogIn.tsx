import { Footer } from 'src/auth/components/Footer'
import { LogInForm } from 'src/auth/components/LogInForm'
import { Logo } from 'src/auth/components/Logo'

export function LogIn() {
  return (
    <div className='my-auto flex min-h-[568px] min-w-[320px] flex-col'>
      <Logo />
      <LogInForm />
      <Footer
        text="Don't have an account?"
        link={{ text: 'Sign Up', to: '/auth/register' }}
      />
    </div>
  )
}
