import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEmail, UserEntity, UserPassword } from 'src/users/entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserForEmailAndPassword(
    email: UserEmail,
    password: UserPassword,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const passwordValid = user.password === password;

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }
}
