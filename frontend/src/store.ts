import { create } from 'zustand'

import { types } from 'src/common'

type NavStore = {
  isHidden: boolean
  hide: () => void
  show: () => void
}

export const useNavStore = create<NavStore>((set) => ({
  isHidden: true,
  hide: () => set((prev) => ({ ...prev, isHidden: true })),
  show: () => set((prev) => ({ ...prev, isHidden: false })),
}))

export type TitleBarStore = {
  title: string
  backCallback: undefined | (() => void)
  actionButton: { text: string; callback: undefined | (() => void) }
  setTitleBar: (obj: Partial<TitleBarStore>) => void
}

export const useTitleBarStore = create<TitleBarStore>((set) => ({
  title: '',
  backCallback: undefined,
  actionButton: { text: '', callback: undefined },
  setTitleBar: (obj: Partial<TitleBarStore>) =>
    set((prev) => ({ ...prev, ...obj })),
}))

type UserStore = {
  user: types.User
  setUser: (user: types.User) => void
}

export const defaultUser: types.User = {
  token: '',
  id: NaN,
  username: '',
  avatar: '',
}

export const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,
  setUser: (user: types.User) => set({ user }),
}))

export type ModalStore = {
  type: 'input' | 'confirm' | undefined
  label: string
  callback: (value: any) => void
  setModal: (obj: Partial<ModalStore>) => void
}

export const useModalStore = create<ModalStore>((set) => ({
  type: undefined,
  label: '',
  callback: () => {},
  setModal: (obj: Partial<ModalStore>) => set((prev) => ({ ...prev, ...obj })),
}))
