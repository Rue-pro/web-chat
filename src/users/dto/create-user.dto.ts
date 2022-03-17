import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ required: false })
  avatar?: string;

  @ApiProperty({ required: false })
  avatarId?: string;

  @ApiProperty({ required: false })
  role?: Role;
}
