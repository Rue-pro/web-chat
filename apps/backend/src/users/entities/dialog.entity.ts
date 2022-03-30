import { User, Message } from '@prisma/client';
import { UserEntity } from './user.entity';

type Dialog = {
  user: User;
  message: Message;
};

export class DialogEntity implements Dialog {
  user: UserEntity;
  message: Message;

  constructor(partialUser: User, partialMessage: Message) {
    this.user = partialUser;
    this.message = partialMessage;
  }
}
