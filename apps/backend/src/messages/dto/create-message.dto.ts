import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsNotEmpty()
  @ApiProperty()
  author: string;

  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  content: string;
}
