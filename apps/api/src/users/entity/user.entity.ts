import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export type UserId = string;
export type UserName = string;
export type UserCreatedAt = Date;
export type UserUpdatedAt = Date;
export type UserEmail = string;
export type UserPhone = string;
export type UserPassword = string;
export type UserCurrentHashedRefreshToken = string;
export type UserAvatar = string;

@Entity('user')
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: UserId;

  @ApiProperty()
  @Column()
  name: UserName;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: UserCreatedAt;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: UserUpdatedAt;

  @ApiProperty()
  @Column({ unique: true })
  email: UserEmail;

  @ApiProperty()
  @Column({ unique: true })
  phone: UserPhone;

  @ApiProperty()
  @Column()
  @Exclude()
  password: UserPassword;

  @ApiProperty()
  @Column({
    nullable: true,
  })
  @Exclude()
  currentHashedRefreshToken?: UserCurrentHashedRefreshToken;

  @ApiProperty()
  @Column({ default: null })
  avatar?: UserAvatar;

  @BeforeInsert()
  async setPassword(password: UserPassword) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password || this.password, salt);
  }
}
