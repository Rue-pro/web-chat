import { ConversationId } from 'src/conversations/entity';
import { UserId } from 'src/users/entity';
import { MessageContent } from '../entity';

export class CreateMessageDto {
  authorId: UserId;

  conversationId: ConversationId;

  content: MessageContent;
}
