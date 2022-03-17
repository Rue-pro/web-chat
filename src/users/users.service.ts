import { UserEntity } from './entities/user.entity';
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { findManyCursorConnection } from '@devoxa/prisma-relay-cursor-connection';
import { ConnectionArgsDto } from 'src/page/connection-args.dto';
import { Page } from 'src/page/page.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findPage(connectionArgs: ConnectionArgsDto) {
    const page = await findManyCursorConnection(
      (args) => {
        console.log(args);
        return this.prisma.user.findMany(args);
      },
      () => this.prisma.user.count(),
      connectionArgs,
      { recordToEdge: (record) => ({ node: new UserEntity(record) }) },
    );

    return new Page<UserEntity>(page);
  }

  findOne(id: string) {
    return this.prisma.user.findFirst({ where: { id: id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({ where: { id: id }, data: updateUserDto });
  }

  remove(id: string) {
    return this.prisma.user.delete({ where: { id: id } });
  }
}
