import { useTitleBarStore } from 'src/store'
import { ActionButton } from 'src/titleBar/components/ActionButton'
import { BackButton } from 'src/titleBar/components/BackButton'
import { Title } from 'src/titleBar/components/Title'

export function TitleBar() {
  const { title, backCallback, actionButton } = useTitleBarStore()

  if (title === '') return <></>

  return (
    <div
      className='bg-bg1 border-bg2 m-1 mb-0 flex rounded-lg border-b-[2px] 
      border-solid'
    >
      <BackButton callback={backCallback} />
      <Title title={title} />
      <ActionButton text={actionButton.text} callback={actionButton.callback} />
    </div>
  )
}
