import { API_URL } from 'src/common'

export const CHATS_URL = `${API_URL}/chats`

export * from 'src/chats/api/createChat'
export * from 'src/chats/api/createMessage'
export * from 'src/chats/api/editChat'
export * from 'src/chats/api/getChat'
export * from 'src/chats/api/getChats'
export * from 'src/chats/api/getMessages'
