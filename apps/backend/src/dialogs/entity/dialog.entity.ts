import { ConversationId } from '.';
import { MessageEntity } from 'src/messages/entity';
import { UserEntity } from 'src/users/entity';

export type DialogUser = Pick<UserEntity, 'id' | 'name' | 'avatar'>;

export type DialogMessage = Pick<MessageEntity, 'id' | 'content' | 'createdAt'>;

export class DialogEntity {
  id: ConversationId;
  user: DialogUser;
  message: DialogMessage;

  constructor(user: DialogUser, message?: DialogMessage) {
    (this.user = user), (this.message = message);
  }
}
