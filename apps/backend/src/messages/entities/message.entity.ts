import { ApiProperty } from '@nestjs/swagger';
import { Message, Receiver } from '@prisma/client';

export class MessageEntity implements Message {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  receiverId: string;

  @ApiProperty()
  receiver_type: Receiver;

  @ApiProperty()
  sentTime: Date;
}
