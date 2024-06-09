export type User = {
  token?: string
  id: number
  username?: string
  avatar?: string
}

export type SelectableUser = User & { selected?: boolean }
