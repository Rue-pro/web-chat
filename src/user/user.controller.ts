import { PrismaService } from './../prisma/prisma.service';
import { Controller, Get } from '@nestjs/common';
import { User as UserModel } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly prismaService: PrismaService) {}

  @Get('users')
  async getAllUsers(): Promise<UserModel[]> {
    return this.prismaService.user.findMany();
  }
}
