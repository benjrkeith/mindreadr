export type User = {
  id: number
  username: string
  avatar: string
  token?: string
  cover?: string
  name?: string
}

export const emptyUser: User = {
  token: '',
  id: NaN,
  username: '',
  avatar: '',
}

export type SelectableUser = User & { selected?: boolean }
