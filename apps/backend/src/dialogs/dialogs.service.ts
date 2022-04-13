import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity, UserId } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';
import {
  ConversationEntity,
  ConversationId,
  DialogEntity,
  DialogMessage,
  DialogUser,
  SearchResultDialogEntity,
} from './entity';
import { SearchFilterDialogDto } from './dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async searchAll(
    filter: SearchFilterDialogDto,
    userId: string,
  ): Promise<SearchResultDialogEntity[]> {
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

    const dialogs = await query.getRawMany();

    return dialogs.map((dialog) => {
      const user: DialogUser = {
        id: dialog.user_id,
        name: dialog.user_name,
        avatar: dialog.user_avatar,
      };
      const message: DialogMessage = {
        id: dialog.id,
        content: dialog.content,
        createdAt: dialog.createdAt,
      };
      return new SearchResultDialogEntity(user, message);
    });
  }

  async findAll(userId: UserId): Promise<DialogEntity[]> {
    console.log('FINDING_DIALOGS_FOR_USER', userId);
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
          .orderBy({ 'messages.createdAt': 'DESC' })
          .limit(1);
        return r;
      },
      'message',
      'conversation.id=message."messages_channelId"',
    );
    query2.leftJoinAndSelect(
      UserEntity,
      'user1',
      'conversation.user1=user1.id ',
    );
    query2.leftJoinAndSelect(
      UserEntity,
      'user2',
      'conversation.user2=user2.id ',
    );
    query2.where('conversation.user1 = :id', { id: userId });
    query2.orWhere('conversation.user2 = :id', { id: userId });

    const dialogs = await query2.getRawMany();
    console.log('ALL_DIALOGS_FOR_THIS_USER', dialogs);
    return dialogs.map((dialog): DialogEntity => {
      const user =
        dialog.user1_id === userId
          ? {
              id: dialog.user2_id,
              name: dialog.user2_name,
              avatar: dialog.user2_avatar,
            }
          : {
              id: dialog.user1_id,
              name: dialog.user1_name,
              avatar: dialog.user1_avatar,
            };
      return {
        id: dialog.conversation_id,
        user: user,
        message: {
          id: dialog.messages_id,
          content: dialog.messages_content,
          createdAt: dialog.messages_createdAt,
        },
      };
    });
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
    console.log(
      `CONVERSATION_BETWEEN authorId=${authorId} AND receiverId=${receiverId} ALREADY EXISTS`,
      conversation,
    );

    if (!conversation) {
      return await this.conversationRepository.save({
        user1: authorId,
        user2: receiverId,
      });
    }
    return conversation;
  }
}
