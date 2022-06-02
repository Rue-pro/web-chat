import { ConversationId } from 'src/conversations/entity';
import { UserId } from 'src/users/entity';
import { MessageContent } from '../entity';

type NewDialog = {
  type: 'NEW_DIALOG';
  id: UserId;
};

type ExistingDialog = {
  type: 'EXISTING_DIALOG';
  id: ConversationId;
};
export class NewMessageDto {
  content: MessageContent;

  currentDialog: NewDialog | ExistingDialog;
}
