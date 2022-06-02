import { Controller, Get, UseGuards, Query, Req } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TokenService } from 'src/auth/token.service';
import { UserEntity } from 'src/users/entity';
import { ConversationsService } from './conversations.service';
import { SearchFilterConversationDto } from './dto';

@Controller('conversations')
@ApiTags('Conversations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class ConversationsController {
  constructor(
    private readonly tokenService: TokenService,
    private readonly ConversationsService: ConversationsService,
  ) {}

  @Get('/search')
  @ApiOperation({ description: 'Поиск по всем диалогам' })
  @ApiOkResponse({
    description: 'Возвращает список диалогов проходящих под критерии фильтра',
    type: [UserEntity],
  })
  async searchAll(
    @Query() filter: SearchFilterConversationDto,
    @Req() request: FastifyRequest,
  ) {
    const user = await this.tokenService.getUserFromToken(
      request.cookies.access_token,
    );
    return this.ConversationsService.searchAll(filter, user.id);
  }

  @Get('')
  @ApiOperation({
    description: 'Запрос списка всех начатых пользователем диалогов',
  })
  @ApiOkResponse({
    description: 'Возвращает список всех начатых ползователем диалогов',
    type: [UserEntity],
  })
  async findAll(@Req() request: FastifyRequest) {
    const user = await this.tokenService.getUserFromToken(
      request.cookies.access_token,
    );

    return this.ConversationsService.findAll(user.id);
  }
}
