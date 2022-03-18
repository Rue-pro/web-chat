import { ApiProperty } from '@nestjs/swagger';
import { User, Role } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @Exclude({ toPlainOnly: true })
  @ApiProperty()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  avatar: string;

  @ApiProperty({ default: Role.DEVELOPER })
  role: Role;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
