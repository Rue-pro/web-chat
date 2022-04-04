import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';

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
  ) {}

  async searchAll(
    filter: SearchFilterDialogDto,
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

  async findAll(): Promise<DialogEntity[]> {
    const query = this.userRepository.createQueryBuilder('user').select('user');

    query.innerJoinAndSelect(
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
      return new DialogEntity(user, message);
    });
  }
}
