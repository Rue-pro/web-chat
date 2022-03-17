import { ApiProperty } from '@nestjs/swagger';

export class Edge<T> {
  @ApiProperty()
  node: T;

  @ApiProperty()
  cursor: string;
}
