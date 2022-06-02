import { ApiProperty } from '@nestjs/swagger';
import { UserId } from 'src/users/entity';

export class TokenPayloadEntity {
  @ApiProperty()
  userId: UserId;
}

export type TokenContent = string;
export type TokenExpiresIn = Date;

export class Token {
  content: TokenContent;
  expiresIn: TokenExpiresIn;
}
