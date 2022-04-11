import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';
import {
  ConversationEntity,
  DialogEntity,
  SearchResultDialogEntity,
} from './entity';
import { DialogMessage, DialogUser } from './entity/types';
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

  async findAll(userId: string): Promise<DialogEntity[]> {
    /**
     * TODO
     * Переписать за более эффективное решение
     */
    const query2 = this.messageRepository
      .createQueryBuilder('message')
      .select('message');
    query2.innerJoinAndSelect(
      ConversationEntity,
      'conversation',
      'message."channelId"=conversation.id',
    );
    query2.orderBy('message.createdAt', 'DESC');
    query2.where('conversation.user1 = :id', { id: userId });
    query2.orWhere('conversation.user2 = :id', { id: userId });

    const messages = await query2.getRawMany();
    console.log('MESSAGES', messages);
    const result: DialogEntity[] = [];
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const lastAddedDialog = result[result.length - 1];

      const user: DialogUser =
        message.author_id === userId
          ? {
              id: message.receiver_id,
              name: message.receiver_name,
              avatar: message.receiver_avatar,
            }
          : {
              id: message.author_id,
              name: message.author_name,
              avatar: message.author_avatar,
            };
      const lastMessage: DialogMessage = {
        id: message.message_id,
        content: message.message_content,
        createdAt: message.message_createdAt,
      };

      const dialog = new DialogEntity(user, lastMessage);
      if (i == 0) {
        result.push(dialog);
        continue;
      }
      if (dialog.user.id === lastAddedDialog.user.id) {
        continue;
      }
      result.push(dialog);
    }

    return result;
  }

  async createConversation(
    authorId: string,
    receiverId: string,
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
    console.log(conversation);

    if (!conversation) {
      return await this.conversationRepository.save({
        user1: authorId,
        user2: receiverId,
      });
    }
    return conversation;
  }
}
