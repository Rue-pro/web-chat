import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

import { ConversationEntity, ConversationId } from 'src/conversations/entity';
import { MessageEntity } from './entity';
import { CreateMessageDto } from './dto';
import { UserId } from 'src/users/entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  saveMessage(createMessageDto: CreateMessageDto): Promise<MessageEntity> {
    return this.messageRepository.save({
      ...createMessageDto,
    });
  }

  async getAllMessages(
    userId: UserId,
    conversationId: ConversationId,
  ): Promise<MessageEntity[]> {
    const query = this.conversationRepository
      .createQueryBuilder('conversation')
      .select('conversation');
    query.innerJoinAndSelect(
      (
        qb: SelectQueryBuilder<MessageEntity>,
      ): SelectQueryBuilder<MessageEntity> => {
        return qb
          .select('messages')
          .from(MessageEntity, 'messages')
          .orderBy({ 'messages.createdAt': 'ASC' });
      },
      'message',
      'conversation.id=message."messages_conversationId"',
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
        createdAt: message.messages_createdAt,
        authorId: message.messages_authorId,
        conversationId,
      };
    });
  }
}
