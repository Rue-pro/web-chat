import { ConversationUser, ConversationMessage } from '.';

export class SearchResultConversationEntity {
  user: ConversationUser;
  message?: ConversationMessage;

  constructor(user: ConversationUser, message: ConversationMessage) {
    this.user = user;
    if (message.id) this.message = message;
  }
}
