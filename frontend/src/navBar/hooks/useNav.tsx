import { useLayoutEffect } from 'react'
import { useNavStore } from 'src/store'

export function useNav(show: boolean) {
  const nav = useNavStore()

  useLayoutEffect(() => {
    if (show) nav.show()
    else nav.hide()
  }, [])
}
