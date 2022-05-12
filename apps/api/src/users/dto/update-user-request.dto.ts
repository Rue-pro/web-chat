import { PartialType } from '@nestjs/swagger';
import { CreateUserRequestDto } from '.';

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {}
