import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';
import { DialogEntity, SearchResultDialogEntity } from './entity';
import { DialogMessage, DialogUser } from './entity/types';
import { SearchFilterDialogDto } from './dto';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  async searchAll(
    filter: SearchFilterDialogDto,
    userId: string,
  ): Promise<SearchResultDialogEntity[]> {
    const { query: filterString } = filter;
    const query = this.userRepository.createQueryBuilder('user').select('user');

    console.log('FILTER', filterString);
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
    query2.leftJoinAndSelect('message.authorId', 'author');
    query2.leftJoinAndSelect('message.receiverId', 'receiver');
    query2.orderBy('message.createdAt', 'DESC');
    query2.where('message.authorId = :id', { id: userId });
    query2.orWhere('message.receiverId = :id', { id: userId });

    const messages = await query2.getRawMany();

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
}
