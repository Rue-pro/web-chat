import { UserEntity } from './../../users/entity/user.entity';
import { Entity, Column } from 'typeorm';

export class AuthEntity {
  accessToken: string;
  userId: string;
}
