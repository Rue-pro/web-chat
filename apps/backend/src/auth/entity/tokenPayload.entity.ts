import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadEntity {
  @ApiProperty()
  userId: string;
}
