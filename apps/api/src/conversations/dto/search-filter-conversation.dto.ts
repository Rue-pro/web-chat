import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class SearchFilterConversationDto {
  @ApiPropertyOptional()
  @IsOptional()
  query?: string;
}
