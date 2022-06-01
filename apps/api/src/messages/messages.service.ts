import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { ConversationEntity } from 'src/conversations/entity';
import { MessageEntity } from './entity';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(
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
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .select('conversation');
    query.innerJoinAndSelect(
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
    query.setParameter('conversationId', conversationId);
    query.setParameter('userId', userId);
    query.where('conversation.id = :conversationId');
    query.andWhere(
      new Brackets((qb) =>
        qb.where('"user1" = :userId').orWhere('"user2" = :userId'),
      ),
    );

    const messages = await query.getRawMany();

    return messages.map((message) => {
      return {
        id: message.messages_id,
        content: message.messages_content,
        createdAt: new Date(message.messages_createdAt).toISOString(),
        authorId: message.messages_authorId,
        dialogId: conversationId,
        receiverId: null,
      };
    });
  }
}
