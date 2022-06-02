import { ConversationEntity, ConversationId } from 'src/conversations/entity';
import { UserEntity, UserId } from 'src/users/entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type MessageId = string;
export type MessageContent = string;
export type MessageCreatedAt = Date;

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: MessageId;

  @Column()
  content: MessageContent;

  @CreateDateColumn()
  createdAt: MessageCreatedAt;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  authorId: UserId;

  @ManyToOne(() => ConversationEntity)
  @JoinColumn({ name: 'conversationId' })
  conversationId: ConversationId;
}
