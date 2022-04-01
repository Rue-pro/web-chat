import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/users/entity';
import { DialogsService } from './dialogs.service';

@Controller('dialogs')
@ApiTags('dialogs')
@ApiBearerAuth()
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    return this.dialogsService.findAll();
  }
}
