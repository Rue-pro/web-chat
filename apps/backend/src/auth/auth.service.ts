import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entity';
import { AuthEntity, TokenPayloadEntity } from './entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    /**
     * TODO
     * Add encription by bcrypt
     */
    const passwordValid = user.password === password;

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }

  validateUser(userId: string) {
    return this.usersService.findOne(userId);
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayloadEntity = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
    if (payload.userId) {
      return this.validateUser(payload.userId);
    }
  }
}
