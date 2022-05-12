import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { AuthService } from 'src/auth/auth.service';
import { ConversationEntity } from 'src/dialogs/entity';
import { MessageEntity } from './entity';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  saveMessage(createMessageDto: CreateMessageDto) {
    return this.messageRepository.save({
      ...createMessageDto,
    });
  }

  async getAllMessages(userId: string, conversationId: string) {
    /**
     * TODO
     * на фронте сделать нормальную обработку ошибок с бэка
     */
    const query2 = this.conversationRepository
      .createQueryBuilder('conversation')
      .select('conversation');
    query2.innerJoinAndSelect(
      (
        qb: SelectQueryBuilder<MessageEntity>,
      ): SelectQueryBuilder<MessageEntity> => {
        const r = qb
          .select('messages')
          .from(MessageEntity, 'messages')
          .orderBy({ 'messages.createdAt': 'ASC' });
        return r;
      },
      'message',
      'conversation.id=message."messages_channelId"',
    );
    query2.setParameter('conversationId', conversationId);
    query2.where('conversation.id = :conversationId');

    const messages = await query2.getRawMany();

    return messages.map((message) => {
      return {
        id: message.messages_id,
        content: message.messages_content,
        createdAt: new Date(message.messages_createdAt).toISOString(),
        authorId: message.messages_authorId,
        dialogId: conversationId,
      };
    });
  }
}
