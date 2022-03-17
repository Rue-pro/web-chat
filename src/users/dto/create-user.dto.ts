import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsNotEmpty()
  @MinLength(12)
  @ApiProperty()
  password: string;

  @IsOptional()
  @ApiProperty({ required: false })
  avatar?: string;

  @IsOptional()
  @ApiProperty({ required: false })
  role?: Role;
}
