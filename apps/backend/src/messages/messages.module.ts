import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [MessagesService, MessagesGateway, UsersService],
})
export class MessagesModule {}
