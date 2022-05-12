import { UserEntity } from 'src/users/entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export type ConversationId = number;

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: ConversationId;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user1' })
  user1: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user2' })
  user2: string;
}
