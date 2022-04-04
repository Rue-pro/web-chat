import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ConnectionArgsDto } from 'src/page/dto';
import { CreateUserDto, SearchFilterUserDto, UpdateUserDto } from './dto';
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

  async findAll(filter: SearchFilterUserDto): Promise<UserEntity[]> {
    const { name, phone } = filter;

    const query = this.userRepository.createQueryBuilder('user');

    if (name) {
      query
        .setParameter('name', `%${name}%`)
        .andWhere((qb) => qb.where('LOWER(user.name) LIKE LOWER(:name)'));
    }

    if (phone) {
      query
        .setParameter('phone', `%${phone}%`)
        .andWhere((qb) => qb.where('LOWER(user.phone) LIKE LOWER(:phone)'));
    }

    const users = await query.getMany();
    return users;
  }

  async findPage(connectionArgs: ConnectionArgsDto) {}

  findOne(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    let toUpdate = await this.userRepository.findOneBy({ id: id });
    Object.assign(toUpdate, updateUserDto);
    const article = await this.userRepository.save(toUpdate);
    return { article };
  }

  delete(id: string): Promise<DeleteResult> {
    return this.userRepository.delete({ id: id });
  }
}
