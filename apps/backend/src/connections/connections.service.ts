import { UserEntity } from 'src/users/entity';
import { UpdateConnectionDto } from './dto/update-connection.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ConnectionEntity } from './entity';
import { CreateConnectionDto } from './dto';

@Injectable()
export class ConnectionsService {
  constructor(
    @InjectRepository(ConnectionEntity)
    private readonly connectionRepository: Repository<ConnectionEntity>,
  ) {}

  async create(createMessageDto: CreateConnectionDto) {
    const user = await this.findOne(createMessageDto.userId);
    if (user) {
      Object.assign(user, createMessageDto);
      return this.connectionRepository.save(user);
    }
    return this.connectionRepository.save(createMessageDto);
  }

  async delete(socketId: string) {
    return this.connectionRepository.delete({ socketId });
  }

  findOne(userId: string) {
    console.log('SEARCHING_FOR_SOCKET_ID_FOR_USER', userId);
    return this.connectionRepository
      .createQueryBuilder('connection')
      .innerJoinAndSelect(UserEntity, 'user', 'connection.userId=user.id')
      .where('user.id = :id', { id: userId })
      .getOne();
  }

  async update(connectionId: string, updateConnection: UpdateConnectionDto) {
    const toUpdate = await this.connectionRepository.findOneBy({
      id: connectionId,
    });
    Object.assign(toUpdate, updateConnection);
    return this.connectionRepository.save(toUpdate);
  }
}
