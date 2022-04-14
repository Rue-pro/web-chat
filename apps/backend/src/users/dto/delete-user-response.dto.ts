import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty()
  raw: [];

  @ApiProperty()
  affected: number;
}
