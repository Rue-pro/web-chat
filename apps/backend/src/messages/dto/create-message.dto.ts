export class CreateMessageDto {
  authorId: string;

  receiverId: string;

  receiver_type: 'GROUP' | 'PERSON';

  content: string;

  sentTime: Date;
}
