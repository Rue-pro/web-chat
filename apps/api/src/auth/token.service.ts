import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';

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
  ) {}

  async validateUser(userId: UserId): Promise<UserEntity> {
    return plainToClass(UserEntity, this.usersService.findOne(userId));
  }

  async verifyAccessToken(accessToken: string): Promise<TokenPayloadEntity> {
    try {
      return this.jwtService.verifyAsync(accessToken);
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new ForbiddenException({
          message: 'Access token is expired, refresh it, then retry the query',
          name: 'ERROR_ACCESS_TOKEN_EXPIRED',
        });
      }
    }
  }

  async getUserFromToken(accessToken: string): Promise<UserEntity> {
    const payload = this.jwtService.decode(accessToken);

    if (!payload || typeof payload === 'string') {
      throw new UnauthorizedException({
        message: 'Invalid accessToken',
        name: 'ERROR_INVALID_ACCESS_TOKEN',
      });
    }

    return this.validateUser(payload.userId);
  }

  async getUserFromSocket(socket: Socket): Promise<UserEntity> {
    const cookie = socket.handshake.headers.cookie;

    if (!cookie) {
      throw new IWSError({
        code: 400,
        message: 'Found no cookie',
        name: 'ERROR_FOUND_NO_COOKIE',
      });
    }

    const { access_token: accessToken } = parse(cookie);
    if (!accessToken) {
      throw new IWSError({
        code: 400,
        message: 'Found no access_token cookie',
        name: 'ERROR_FOUND_NO_ACCESS_TOKEN_COOKIE',
      });
    }

    const user = await this.verifyAccessToken(accessToken);
    return this.validateUser(user.userId);
  }

  async generateAccessToken(userId: UserId): Promise<Token> {
    const payload: TokenPayloadEntity = { userId };
    const expirationTime = this.configService.get(
      'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${expirationTime}m`,
    });

    let expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + +expirationTime);

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }

  async generateRefreshToken(userId: UserId): Promise<Token> {
    const payload: TokenPayloadEntity = { userId };
    const expirationTime = this.configService.get(
      'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
    );

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${expirationTime}m`,
    });

    let expiresIn = new Date();
    expiresIn.setMinutes(expiresIn.getMinutes() + +expirationTime);

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }
}
