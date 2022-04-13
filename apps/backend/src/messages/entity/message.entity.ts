import { ConversationEntity } from 'src/dialogs/entity';
import { UserEntity } from 'src/users/entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  authorId: string;

  @ManyToOne(() => ConversationEntity)
  @JoinColumn({ name: 'channelId' })
  channelId: number;
}
