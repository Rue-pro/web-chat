import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadEntity {
  @ApiProperty()
  userId: string;
}

export type TokenContent = string;
export type TokenExpiresIn = Date;

export class Token {
  content: TokenContent;
  expiresIn: TokenExpiresIn;
}
