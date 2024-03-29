import { UserEntity, UserId } from 'src/users/entity';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ConnectionEntity, ConnectionId } from './entity';
import { CreateConnectionDto } from './dto';
import { SocketId } from 'src/socket/types';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ConnectionEntity)
    private readonly connectionRepository: Repository<ConnectionEntity>,
  ) {}

  async create(
    createMessageDto: CreateConnectionDto,
  ): Promise<ConnectionEntity> {
    const user = await this.findOne(createMessageDto.userId);
    if (user) {
      Object.assign(user, createMessageDto);
      return this.connectionRepository.save(user);
    }
    return this.connectionRepository.save(createMessageDto);
  }

  delete(socketId: SocketId): Promise<DeleteResult> {
    return this.connectionRepository.delete({ socketId });
  }

  findOne(userId: UserId): Promise<ConnectionEntity> {
    return this.connectionRepository
      .createQueryBuilder('connection')
      .innerJoinAndSelect(UserEntity, 'user', 'connection.userId=user.id')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async update(
    connectionId: ConnectionId,
    updateConnection: UpdateConnectionDto,
  ): Promise<ConnectionEntity> {
    const toUpdate = await this.connectionRepository.findOneBy({
      id: connectionId,
    });
    Object.assign(toUpdate, updateConnection);
    return this.connectionRepository.save(toUpdate);
  }
}
