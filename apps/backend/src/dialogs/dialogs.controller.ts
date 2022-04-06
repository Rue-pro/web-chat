import { Controller, Get, UseGuards, Query, Body, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserEntity } from 'src/users/entity';
import { DialogsService } from './dialogs.service';
import { SearchFilterDialogDto } from './dto';

@Controller('dialogs')
@ApiTags('dialogs')
@ApiBearerAuth()
export class DialogsController {
  constructor(
    private readonly authService: AuthService,
    private readonly dialogsService: DialogsService,
  ) {}

  @Get('/search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Поиск по всем диалогам' })
  @ApiOkResponse({
    description: 'Возвращает список диалогов проходящих под критерии фильтра',
    type: [UserEntity],
  })
  async searchAll(
    @Query() filter: SearchFilterDialogDto,
    @Req() request: FastifyRequest,
  ) {
    const user = await this.authService.getUserFromAuthenticationToken(
      request.cookies.access_token,
    );
    return this.dialogsService.searchAll(filter, user.id);
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
  async findAll(@Req() request: FastifyRequest) {
    const user = await this.authService.getUserFromAuthenticationToken(
      request.cookies.access_token,
    );
    console.log('FIND_ALL_USER', user);
    return this.dialogsService.findAll(user.id);
  }
}
