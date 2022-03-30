import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';

import { AuthService } from 'src/auth/auth.service';
import { MessageEntity } from './entity';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async getUserFromSocket(socket: Socket) {
    console.log('GET_USER_FROM_SOCKET');
    const cookie = socket.handshake.headers.cookie;
    const { access_token } = parse(cookie);
    console.log('ACCESS_TOKEN', access_token);
    const user = await this.authService.getUserFromAuthenticationToken(
      access_token,
    );
    console.log('USER', user);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async saveMessage(createMessageDto: CreateMessageDto) {
    return this.messageRepository.save(createMessageDto);
  }

  async getAllMessages(id: string) {
    console.log('GET_ALL_MESSAGES');
    return this.messageRepository.find({ where: { authorId: id } });
  }
}
