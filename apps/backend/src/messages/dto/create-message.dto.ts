import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty()
  authorId: string;

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  content: string;
}
