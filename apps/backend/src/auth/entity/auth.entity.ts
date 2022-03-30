import { Entity, Column } from 'typeorm';

@Entity('auth')
export class AuthEntity {
  @Column()
  accessToken: string;
}
