import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  UserAvatar,
  UserEmail,
  UserName,
  UserPassword,
  UserPhone,
} from '../entity';

export class CreateUserRequestDto {
  @ApiProperty()
  name: UserName;

  @ApiProperty()
  email: UserEmail;

  @ApiProperty()
  phone: UserPhone;

  @ApiProperty()
  password: UserPassword;

  @ApiPropertyOptional()
  @IsOptional()
  avatar?: UserAvatar;
}
