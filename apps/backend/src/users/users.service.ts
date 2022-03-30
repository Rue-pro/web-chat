import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ConnectionArgsDto } from 'src/page/dto';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.save(createUserDto);
  }

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findPage(connectionArgs: ConnectionArgsDto) {}

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let toUpdate = await this.userRepository.findOne({ id: id });
    Object.assign(toUpdate, updateUserDto);
    const article = await this.userRepository.save(toUpdate);
    return { article };
  }

  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete({ id: id });
  }
}
