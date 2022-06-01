import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity, UserId } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';
import {
  ConversationEntity,
  ConversationId,
  DialogEntity,
  ConversationMessage,
  ConversationUser,
  SearchResultConversationEntity,
} from './entity';
import { SearchFilterConversationDto } from './dto';

@Injectable()
export class ConversationsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  private getCompanion(conversation, userId: UserId): ConversationUser {
    return conversation.user1_id === userId
      ? {
          id: conversation.user2_id,
          name: conversation.user2_name,
          avatar: conversation.user2_avatar,
        }
      : {
          id: conversation.user1_id,
          name: conversation.user1_name,
          avatar: conversation.user1_avatar,
        };
  }

  async searchAll(
    filter: SearchFilterConversationDto,
    userId: string,
  ): Promise<SearchResultConversationEntity[]> {
    const { query: filterString } = filter;
    const query = this.userRepository.createQueryBuilder('user').select('user');

    if (filterString) {
      query
        .setParameter('filter', `%${filterString}%`)
        .andWhere(
          new Brackets((qb) =>
            qb
              .where('LOWER(user.name) LIKE LOWER(:filter)')
              .orWhere('LOWER(user.password) LIKE LOWER(:filter)'),
          ),
        );
    }

    query.andWhere({ id: Not(userId) });

    query.leftJoinAndSelect(
      (
        qb: SelectQueryBuilder<MessageEntity>,
      ): SelectQueryBuilder<MessageEntity> => {
        const r = qb
          .from(MessageEntity, 'messages')
          .orderBy({ 'messages.createdAt': 'ASC' })
          .take(1);
        return r;
      },
      'messages',
      'messages."authorId" = user.id',
    );

    const Conversations = await query.getRawMany();

    return Conversations.map((Conversation) => {
      const user: ConversationUser = {
        id: Conversation.user_id,
        name: Conversation.user_name,
        avatar: Conversation.user_avatar,
      };
      const message: ConversationMessage = {
        id: Conversation.id,
        content: Conversation.content,
        createdAt: Conversation.createdAt,
      };
      return new SearchResultConversationEntity(user, message);
    });
  }

  async findAll(userId: UserId): Promise<DialogEntity[]> {
    const queryConversations =
      this.conversationRepository.createQueryBuilder('conversation');
    queryConversations.leftJoinAndSelect(
      UserEntity,
      'user1',
      'conversation.user1=user1.id ',
    );
    queryConversations.leftJoinAndSelect(
      UserEntity,
      'user2',
      'conversation.user2=user2.id ',
    );
    queryConversations.where('conversation.user1 = :id', { id: userId });
    queryConversations.orWhere('conversation.user2 = :id', { id: userId });

    const conversations = await queryConversations.getRawMany();

    return Promise.all(
      conversations.map(async (conversation) => {
        const lastMessage = await this.messageRepository
          .createQueryBuilder('message')
          .where('message."channelId" = :conversationId', {
            conversationId: conversation.conversation_id,
          })
          .orderBy('message."createdAt"', 'DESC')
          .getOne();

        return {
          id: conversation.conversation_id,
          user: this.getCompanion(conversation, userId),
          message: lastMessage,
        };
      }),
    );
  }

  async findOne(id: ConversationId): Promise<ConversationEntity> {
    const query = await this.conversationRepository.createQueryBuilder('*');
    query.select(['id', 'user1', 'user2']);
    query.setParameter('conversationId', id);
    query.where('id = :conversationId');

    return query.getRawOne();
  }

  async createConversation(
    authorId: UserId,
    receiverId: UserId,
  ): Promise<ConversationEntity> {
    const query = await this.conversationRepository.createQueryBuilder(
      'conversation',
    );
    query.setParameter('authorId', authorId);
    query.setParameter('receiverId', receiverId);
    query.andWhere(
      new Brackets((qb) =>
        qb.where('"user1" = :authorId').andWhere('"user2" = :receiverId'),
      ),
    );
    query.orWhere(
      new Brackets((qb) =>
        qb.where('"user1" = :receiverId').andWhere('"user2" = :authorId'),
      ),
    );

    const conversation = await query.getOne();

    if (!conversation) {
      return await this.conversationRepository.save({
        user1: authorId,
        user2: receiverId,
      });
    }
    return conversation;
  }
}
