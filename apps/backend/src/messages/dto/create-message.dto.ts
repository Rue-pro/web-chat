import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty()
  authorId: string;

  @IsNotEmpty()
  @ApiProperty()
  receiverId: string;

  @IsNotEmpty()
  @ApiProperty()
  receiver_type: 'GROUP' | 'PERSON';

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @ApiProperty()
  sentTime: Date;
}
