export function AuthInput(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
) {
  return (
    <input
      type='text'
      spellCheck='false'
      {...props}
      placeholder={props.name}
      className='text-center text-black rounded-lg w-8/12 h-fit
      py-2 max-w-96 sm:text-2xl sm:py-4'
    />
  )
}
