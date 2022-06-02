import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity, UserId } from 'src/users/entity';
import { SocketId } from 'src/socket/types';

export type ConnectionId = string;

@Entity('connection')
export class ConnectionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: ConnectionId;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  userId: UserId;

  @Column()
  socketId: SocketId;
}
