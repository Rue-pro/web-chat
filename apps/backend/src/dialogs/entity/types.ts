import { MessageEntity } from 'src/messages/entity';
import { UserEntity } from 'src/users/entity';

export type DialogUser = Pick<UserEntity, 'id' | 'name' | 'avatar'>;

export type DialogMessage = Pick<MessageEntity, 'id' | 'content' | 'createdAt'>;
