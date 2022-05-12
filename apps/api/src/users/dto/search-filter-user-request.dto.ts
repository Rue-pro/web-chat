import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserName, UserPhone } from '../entity';

export class SearchFilterUserRequestDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: UserName;

  @ApiPropertyOptional()
  @IsOptional()
  phone?: UserPhone;
}
