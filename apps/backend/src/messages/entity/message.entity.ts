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

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'authorId' })
  authorId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'receiverId' })
  receiverId: string;

  @Column()
  receiverType: 'PERSON' | 'GROUP';
}
