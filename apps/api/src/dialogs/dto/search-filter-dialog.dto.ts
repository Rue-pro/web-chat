import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchFilterDialogDto {
  @ApiPropertyOptional()
  @IsOptional()
  query?: string;
}
