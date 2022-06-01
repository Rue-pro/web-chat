import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Socket } from 'socket.io';
import { parse } from 'cookie';

import { UsersService } from 'src/users/users.service';
import { UserEntity, UserId } from 'src/users/entity';
import { Token, TokenPayloadEntity } from './entity';
import { IWSError } from 'src/error/ws.error.interface';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async validateUser(userId: UserId): Promise<UserEntity> {
    return this.usersService.findOne(userId);
  }

  async verifyAccessToken(accessToken: string) {
    try {
      return this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new ForbiddenException({
          message: 'Access token is required, then retry the query',
          name: 'ERROR_ACCESS_TOKEN_EXPIRED',
        });
      }
    }
  }

  async getUserFromToken(accessToken: string): Promise<UserEntity> {
    const decodedToken = this.jwtService.decode(accessToken);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid accessToken');
    }

    return await this.validateUser(decodedToken.userId);
  }

  async getUserFromSocket(socket: Socket): Promise<UserEntity> {
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
      throw new IWSError({
        code: 400,
        message: 'Found no cookie.',
        name: 'ERROR_FOUND_NO_COOKIE',
      });
    }

    const { access_token: accessToken } = parse(cookie);
    if (!accessToken) {
      throw new IWSError({
        code: 400,
        message: 'Found no access_token cookie',
        name: 'ERROR_FOUNR_NO_ACCESS_TOKEN_COOKIE',
      });
    }

    const result = await this.verifyAccessToken(accessToken);

    console.log('GET_USER_FROM_SOCKET', result);

    return this.validateUser(result.userId);
  }

  async generateAccessToken(userId: UserId): Promise<Token> {
    const payload: TokenPayloadEntity = { userId };

    let expiresIn = new Date();
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}m`,
    });

    expiresIn.setMinutes(
      expiresIn.getMinutes() +
        +this.configService.get<number>('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }

  async generateRefreshToken(userId: UserId): Promise<Token> {
    const payload: TokenPayloadEntity = { userId };
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}m`,
    });

    let expiresIn = new Date();
    expiresIn.setMinutes(
      expiresIn.getMinutes() +
        +this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }
}
