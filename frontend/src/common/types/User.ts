export type User = {
  id: number
  username: string
  avatar: string
  token?: string
  cover?: string
  name?: string
}

export type SelectableUser = User & { selected?: boolean }
