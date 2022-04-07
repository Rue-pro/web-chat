import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { parse } from 'cookie';

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
    console.log('LOGIN', user);
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
      userId: user.id,
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

  public async getUserFromSocket(socket: Socket): Promise<UserEntity> {
    console.log('GET_USER_FROM_SOCKET');
    const cookie = socket.handshake.headers.cookie;
    const { access_token } = parse(cookie);
    console.log('ACCESS_TOKEN', access_token);
    const user = await this.getUserFromAuthenticationToken(access_token);
    console.log('USER', user);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }
}
