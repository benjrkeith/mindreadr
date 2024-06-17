import { useLayoutEffect } from 'react'
import { TitleBarStore, useTitleBarStore } from 'src/store'

export function useTitleBar(
  titleBar: Partial<TitleBarStore>,
  deps: any[] = [],
) {
  const { setTitleBar } = useTitleBarStore()

  useLayoutEffect(() => {
    setTitleBar(titleBar)
  }, deps)
}
