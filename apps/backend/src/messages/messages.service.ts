import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { AuthService } from 'src/auth/auth.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    console.log('GET_USER_FROM_SOCKET');
    const cookie = socket.handshake.headers.cookie;
    console.log('COOKIE', cookie);
    const { access_token: authenticationToken } = parse(cookie);
    console.log('AUTHENTICATION_TOKEN', authenticationToken);
    const user = await this.authService.getUserFromAuthenticationToken(
      authenticationToken,
    );
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async saveMessage(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({ data: createMessageDto });
  }

  async getAllMessages(id: any) {
    console.log('GET_ALL_MESSAGES');
    const authorId = 'cl10bf6sg000497l4lfivj7k7';
    return this.prisma.message.findMany({ where: { authorId: authorId } });
  }
}
