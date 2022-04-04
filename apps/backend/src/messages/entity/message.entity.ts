import { UserEntity } from 'src/users/entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  receiverId: string;

  @Column()
  receiverType: 'PERSON' | 'GROUP';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.messages, { cascade: true })
  @JoinColumn({ name: 'authorId' })
  author: UserEntity;

  @Column()
  @RelationId((message: MessageEntity) => message.author)
  authorId: string;
}
