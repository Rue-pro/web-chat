import { ConversationId } from '.';
import { MessageEntity } from 'src/messages/entity';
import { UserEntity } from 'src/users/entity';

export type ConversationUser = Pick<UserEntity, 'id' | 'name' | 'avatar'>;

export type ConversationMessage = Pick<
  MessageEntity,
  'id' | 'content' | 'createdAt'
>;

export class DialogEntity {
  id: ConversationId;
  user: ConversationUser;
  message: ConversationMessage;

  constructor(user: ConversationUser, message?: ConversationMessage) {
    this.user = user;
    this.message = message;
  }
}
