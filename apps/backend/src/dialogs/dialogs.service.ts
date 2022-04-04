import { DialogEntity, DialogMessageEntity, DialogUserEntity } from './entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { UserEntity } from 'src/users/entity';
import { MessageEntity } from 'src/messages/entity';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<DialogEntity[]> {
    /**
     * userRepository.find({
          join: {
              alias: "user",
              leftJoinAndSelect: {
                  profile: "user.profile",
                  photo: "user.photos",
                  video: "user.videos",
              },
          },
      });
     */
    const dialogs = await this.userRepository
      .createQueryBuilder('user')
      .select('user')
      .innerJoinAndSelect(
        (
          qb: SelectQueryBuilder<MessageEntity>,
        ): SelectQueryBuilder<MessageEntity> => {
          const r = qb
            .from(MessageEntity, 'messages')
            .orderBy({ 'messages.createdAt': 'ASC' })
            .limit(1);
          return r;
        },
        'message',
        'message."authorId" = user.id',
      )
      .getRawMany();

    return dialogs.map((dialog) => {
      const user: DialogUserEntity = {
        id: dialog.user_id,
        name: dialog.user_name,
        avatar: dialog.user_avatar,
      };
      const message: DialogMessageEntity = {
        id: dialog.id,
        content: dialog.content,
        createdAt: dialog.createdAt,
      };
      return new DialogEntity(user, message);
    });
  }
}
