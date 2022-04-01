export class CreateMessageDto {
  authorId: string;

  receiverId: string;

  receiverType: 'GROUP' | 'PERSON';

  content: string;

  createdAt: Date;
}
