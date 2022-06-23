import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

import {
  CreateUserRequestDto,
  SearchFilterUserRequestDto,
  UpdateUserRequestDto,
} from './dto';
import { UserEntity, UserId } from './entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  create(createUserDto: CreateUserRequestDto): Promise<UserEntity> {
    return this.userRepository.save(createUserDto);
  }

  findAll(filter: SearchFilterUserRequestDto): Promise<UserEntity[]> {
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

    return query.getMany();
  }

  async findOne(id: UserId): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    return user;
  }

  async update(
    id: UserId,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    Object.assign(toUpdate, updateUserDto);
    return this.userRepository.save(toUpdate);
  }

  delete(id: UserId): Promise<DeleteResult> {
    return this.userRepository.delete({ id });
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    id: UserId,
  ): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    Object.assign(toUpdate, { currentHashedRefreshToken });
    return plainToClass(UserEntity, this.userRepository.save(toUpdate));
  }

  async getUserIfRefreshTokenMatches(
    refreshToken: string,
    id: UserId,
  ): Promise<UserEntity> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async removeRefeshToken(id: UserId): Promise<UserEntity> {
    let toUpdate = await this.userRepository.findOneBy({ id });
    if (!toUpdate) {
      throw new NotFoundException(`No user found for id: ${id}`);
    }
    Object.assign(toUpdate, { currentHashedRefreshToken: null });
    return this.userRepository.save(toUpdate);
  }
}
