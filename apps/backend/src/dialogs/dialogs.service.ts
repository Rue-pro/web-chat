import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from 'src/users/entity';

@Injectable()
export class DialogsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    const result = await this.userRepository.find({
      relations: {
        messages: true,
      },
    });
    console.log('RESULT', result);
    return result;
  }
}
