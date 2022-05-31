import {
  ForbiddenException,
  Injectable,
  NotFoundException,
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

  private validateUser(userId: UserId) {
    return this.usersService.findOne(userId);
  }

  async getUserIdFromToken(accessToken: string): Promise<UserEntity> {
    const decodedToken = this.jwtService.decode(accessToken);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid accessToken');
    }

    return await this.validateUser(decodedToken.userId);
  }

  async getUserFromSocket(socket: Socket): Promise<UserEntity | IWSError> {
    const cookie = socket.handshake.headers.cookie;
    console.log('SOCKET COOKIE', socket.handshake.headers.cookie);
    if (!cookie) {
      return new IWSError({
        code: 400,
        message: 'Found no cookie.',
        name: 'ERROR_FOUND_NO_COOKIE',
      });
    }

    const { access_token: accessToken } = parse(cookie);
    if (!accessToken) {
      return new IWSError({
        code: 400,
        message: 'Found no access_token cookie',
        name: 'ERROR_FOUNR_NO_ACCESS_TOKEN_COOKIE',
      });
    }

    let payload: TokenPayloadEntity = { userId: null };
    try {
      payload = this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return new IWSError({
          code: 403,
          message: 'Refreshing token is required, then retry the query',
          name: 'ERROR_ACCESS_TOKEN_EXPIRED',
        });
      }
    }

    return this.validateUser(payload.userId);
  }

  async verifyToken(accessToken: string) {
    try {
      return this.jwtService.verify(accessToken, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      });
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new ForbiddenException({
          message: 'Refreshing token is required, then retry the query',
          name: 'ERROR_ACCESS_TOKEN_EXPIRED',
        });
      }
    }
  }

  generateAccessToken(userId: UserId): Token {
    const payload: TokenPayloadEntity = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    let expiresIn = new Date();
    expiresIn.setSeconds(
      expiresIn.getSeconds() +
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }

  generateRefreshToken(userId: UserId): Token {
    const payload: TokenPayloadEntity = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    let expiresIn = new Date();
    expiresIn.setSeconds(
      expiresIn.getSeconds() +
        this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    );

    return {
      content: token,
      expiresIn: expiresIn,
    };
  }
}
