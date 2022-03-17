import { ApiProperty } from '@nestjs/swagger';

export class PageInfo {
  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty({ required: false })
  startCursor?: string;

  @ApiProperty({ required: false })
  endCursor?: string;
}
