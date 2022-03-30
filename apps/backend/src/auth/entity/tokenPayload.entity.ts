import { ApiProperty } from '@nestjs/swagger';

export class TokenPayload {
  @ApiProperty()
  userId: string;
}
