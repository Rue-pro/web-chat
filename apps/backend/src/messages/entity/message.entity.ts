import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('message')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  content: string;

  @Column()
  authorId: string;

  @Column()
  receiverId: string;

  @Column()
  receiver_type: 'PERSON' | 'GROUP';

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
