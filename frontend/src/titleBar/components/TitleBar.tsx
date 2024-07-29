import { ActionButton } from 'src/titleBar/components/ActionButton'
import { BackButton } from 'src/titleBar/components/BackButton'
import { Title } from 'src/titleBar/components/Title'

interface TitleBarProps {
  title: string
  action?: {
    text: string
    callback: () => void
  }
  goBack?: () => void
}

export function TitleBar(props: TitleBarProps) {
  const { title, goBack } = props
  let { action } = props

  if (action === undefined) action = { text: '', callback: () => {} }

  return (
    <div className='bg-dark_bg_1dp flex drop-shadow-lg'>
      <BackButton callback={goBack} />
      <Title title={title} />
      <ActionButton text={action.text} callback={action.callback} />
    </div>
  )
}
