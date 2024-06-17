import { types } from 'src/common'

export const translateSystemMessage = (msg: types.Message) => {
  switch (msg.content) {
    case '0000':
      return `${msg.author.username} created the chat.`
    case '0001':
      return `${msg.author.username} renamed the chat.`
    case '0002':
      return `${msg.author.username} was added to the chat.`
    case '0003':
      return `${msg.author.username} left the chat.`
    default:
      return msg.content
  }
}
