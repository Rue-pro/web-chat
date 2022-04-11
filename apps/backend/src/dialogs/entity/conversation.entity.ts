import { UserEntity } from 'src/users/entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('conversation')
export class ConversationEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user1' })
  user1: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user2' })
  user2: string;
}
