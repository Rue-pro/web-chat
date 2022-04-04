import { UserEntity } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';

export type DialogUserEntity = Pick<UserEntity, 'id' | 'name' | 'avatar'>;
export type DialogMessageEntity = Pick<
  MessageEntity,
  'id' | 'content' | 'createdAt'
>;

export class DialogEntity {
  user: DialogUserEntity;
  message: DialogMessageEntity;

  constructor(user: DialogUserEntity, message: DialogMessageEntity) {
    (this.user = user), (this.message = message);
  }
}
