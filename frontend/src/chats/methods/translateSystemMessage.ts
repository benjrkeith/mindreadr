import { types } from 'src/common'

export const translateSystemMessage = (msg: types.Message) => {
  switch (msg.content) {
    case '0000':
      return `${msg.author.username} created the chat.`
    default:
      return msg.content
  }
}
