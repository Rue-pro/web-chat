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
    console.log('CREATE');
    console.log(createMessageDto);
    const user = await this.connectionRepository.findOne({
      where: {
        id: createMessageDto.userId,
      },
    });
    console.log('connection', user);
    if (user) return user;
    return this.connectionRepository.save(createMessageDto);
  }

  async delete(socketId: string) {
    return this.connectionRepository.delete({ socketId });
  }

  async findOne(userId: string) {
    return this.connectionRepository.findOneBy({
      userId,
    });
  }
}
