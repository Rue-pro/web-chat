import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

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

  saveMessage(createMessageDto: CreateMessageDto) {
    return this.messageRepository.save({
      ...createMessageDto,
    });
  }

  async getAllMessages(userId: string, dialogId: string) {
    console.log('GET_ALL_MESSAGES');
    /**
     * TODO
     * на фронте сделать нормальную обработку ошибок с бэка
     */
    const query = this.messageRepository
      .createQueryBuilder('message')
      .addSelect([
        'id',
        'content',
        '"createdAt"',
        '"receiverId"',
        '"authorId"',
      ]);

    query.setParameter('authorId', userId);
    query.setParameter('receiverId', dialogId);
    query.andWhere(
      new Brackets((qb) =>
        qb
          .where('"authorId" = :authorId')
          .andWhere('"receiverId" = :receiverId'),
      ),
    );
    query.orWhere(
      new Brackets((qb) =>
        qb
          .where('"authorId" = :receiverId')
          .andWhere('"receiverId" = :authorId'),
      ),
    );

    query.orderBy({
      'message."createdAt"': 'ASC',
    });

    const messages = await query.getRawMany();

    return messages.map((message) => {
      const owner = message.authorId === userId ? 'own' : 'theirs';
      return {
        id: message.id,
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
        owner,
      };
    });
  }
}
