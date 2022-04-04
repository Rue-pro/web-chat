import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/users/entity';
import { DialogsService } from './dialogs.service';
import { SearchFilterDialogDto } from './dto';

@Controller('dialogs')
@ApiTags('dialogs')
@ApiBearerAuth()
export class DialogsController {
  constructor(private readonly dialogsService: DialogsService) {}

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Поиск по всем диалогам' })
  @ApiOkResponse({
    description: 'Возвращает список диалогов проходящих под критерии фильтра',
    type: [UserEntity],
  })
  async searchAll(@Query() filter: SearchFilterDialogDto) {
    return this.dialogsService.searchAll(filter);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description: 'Запрос списка всех начатых пользователем диалогов',
  })
  @ApiOkResponse({
    description: 'Возвращает список всех начатых ползователем диалогов',
    type: [UserEntity],
  })
  async findAll() {
    return this.dialogsService.findAll();
  }
}
