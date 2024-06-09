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

// type TitleBarStore = {
//   title: string
//   backCallback: undefined | (() => void)
//   actionButton: { text: string; callback: undefined | (() => void) }
//   setTitleBar: (
//     title: string,
//     backCallback: undefined | (() => void),
//     actionButton: { text: string; callback: undefined | (() => void) },
//   ) => void
// }

type TitleBarArgs = {
  title?: string
  backCallback?: () => void
  actionButton?: { text: string; callback: undefined | (() => void) }
}

type TitleBarStore = {
  title: string
  backCallback: undefined | (() => void)
  actionButton: { text: string; callback: undefined | (() => void) }
  setTitleBar: (obj: TitleBarArgs) => void
}

// export const useTitleBarStore = create<TitleBarStore>((set) => ({
//   title: '',
//   backCallback: undefined,
//   actionButton: { text: '', callback: undefined },
//   setTitleBar: (
//     title: string,
//     backCallback: undefined | (() => void),
//     actionButton: { text: string; callback: undefined | (() => void) },
//   ) => set({ title, backCallback, actionButton }),
// }))

export const useTitleBarStore = create<TitleBarStore>((set) => ({
  title: '',
  backCallback: undefined,
  actionButton: { text: '', callback: undefined },
  setTitleBar: (obj: TitleBarArgs) => set((prev) => ({ ...prev, ...obj })),
}))

type UserStore = {
  user: types.User
  setUser: (user: types.User) => void
}

export const defaultUser = {
  token: '',
  id: NaN,
  username: '',
  avatar: '',
}

export const useUserStore = create<UserStore>((set) => ({
  user: defaultUser,
  setUser: (user: types.User) => set({ user }),
}))

// type ChatStore = {
//   chats: types.Chat[]
//   getChat: (id: number) => types.Chat | undefined
//   setChats: (chats: types.Chat[]) => void
// }

// export const useChatStore = create<ChatStore>((set, get) => ({
//   chats: [],
//   getChat: (id: number) => get().chats.find((chat) => chat.id === id),
//   setChats: (chats: types.Chat[]) => set({ chats }),
// }))

type ChatStore = {
  chats: Map<number, types.Chat>
  getChat: (id: number) => types.Chat | undefined
  setChat: (id: number, chat: types.Chat) => void

  appendMessage: (chatId: number, message: types.Message) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: new Map<number, types.Chat>(),
  getChat: (id: number) => get().chats.get(id),
  setChat: (id: number, chat: types.Chat) =>
    set((prev) => {
      const map = new Map(prev.chats)
      map.set(id, chat)
      return { ...prev, chats: map }
    }),

  appendMessage: (chatId: number, message: types.Message) => {
    set((prev) => {
      const map = new Map(prev.chats)
      const chat = map.get(chatId)
      if (chat === undefined) return prev

      chat.messages.push(message)
      return { ...prev, chats: map }
    })
  },
}))
