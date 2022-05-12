import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';
import {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  SearchFilterUserRequestDto,
  DeleteUserResponseDto,
} from './dto';
import { UserEntity } from './entity';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Создание пользователя' })
  @ApiCreatedResponse({
    description: 'Возвращает созданного пользователя',
    type: UserEntity,
  })
  create(@Body() CreateUserRequestDto: CreateUserRequestDto) {
    return this.usersService.create(CreateUserRequestDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Запрос списка всех пользователей' })
  @ApiOkResponse({
    description: 'Возвращает список всех пользователей',
    type: [UserEntity],
  })
  findAll(@Query() filter: SearchFilterUserRequestDto) {
    return this.usersService.findAll(filter);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Поиск пользователя по id' })
  @ApiOkResponse({
    description: 'Возвращает найденного пользователя',
    type: UserEntity,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Обновление данных пользователя по id' })
  @ApiCreatedResponse({
    description: 'Возвращает обновленного пользователя',
    type: UserEntity,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ description: 'Удаление пользователя по id' })
  @ApiOkResponse({
    description: 'Возвращает количество удаленных пользователей',
    type: DeleteUserResponseDto,
  })
  remove(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
