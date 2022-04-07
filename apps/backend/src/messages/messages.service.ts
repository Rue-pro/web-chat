import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';

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

  saveMessage(createMessageDto: CreateMessageDto) {
    return this.messageRepository.save({
      ...createMessageDto,
    });
  }

  async getAllMessages(userId: string, dialogId: string) {
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
      return {
        id: message.id,
        content: message.content,
        createdAt: new Date(message.createdAt).toISOString(),
        authorId: message.authorId,
        receiverId: message.receiverId,
      };
    });
  }
}
