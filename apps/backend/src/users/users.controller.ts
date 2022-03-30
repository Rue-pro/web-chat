import { ApiPageResponse } from './../page/api-page-response';
import { UserEntity } from './entities/user.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ConnectionArgsDto } from 'src/page/connection-args.dto';
import { Page } from 'src/page/page.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DialogEntity } from './entities/dialog.entity';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@ApiExtraModels(Page)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return new UserEntity(user);
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [UserEntity] })
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserEntity(user));
  }

  @Get('page')
  @UseGuards(JwtAuthGuard)
  @ApiPageResponse(UserEntity)
  async findPage(@Query() connectionArgs: ConnectionArgsDto) {
    return this.usersService.findPage(connectionArgs);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    return new UserEntity(user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return new UserEntity(user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.remove(id);
    return new UserEntity(user);
  }

  @Get('dialogs')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: [DialogEntity] })
  async findDialogs() {
    const users = await this.usersService.findDialogs();
    return users.map((user) => {
      const { message: messages, ...userInfo } = user;
      return new DialogEntity(userInfo, messages[0]);
    });
  }
}
