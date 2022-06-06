import { RawMessage, Message } from './types'

export const rawMessageToMessage = (message: RawMessage): Message => {
  return {
    id: message.id,
    createdAt: new Date(message.createdAt),
    content: message.content,
    authorId: message.authorId,
    receiverId: message.receiverId,
    dialogId: message.conversationId,
  }
}
