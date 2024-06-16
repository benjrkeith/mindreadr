import { ConfirmModal } from 'src/modals/components/ConfirmModal'
import { InputModal } from 'src/modals/components/InputModal'
import { useModalStore } from 'src/store'

export default function MultiModal() {
  const { type } = useModalStore()

  switch (type) {
    case 'input':
      return <InputModal />
    case 'confirm':
      return <ConfirmModal />
    default:
      return <></>
  }
}
