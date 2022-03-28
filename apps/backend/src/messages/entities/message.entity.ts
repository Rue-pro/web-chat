import { ApiProperty } from '@nestjs/swagger';

export type Message = {
  id: string;
  content: string;
  author: string;
};

export class MessageEntity implements Message {
  @ApiProperty()
  id: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  author: string;
}
