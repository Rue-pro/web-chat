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
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getUserForEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserEntity> {
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

    return user;
  }

  validateUser(userId: UserId) {
    return this.usersService.findOne(userId);
  }

  async getUserFromAuthenticationToken(
    accessToken: string,
  ): Promise<UserEntity> {
    const decodedToken = this.jwtService.decode(accessToken);
    console.log('DECODED TOKEN', decodedToken);
    if (!decodedToken || typeof decodedToken === 'string') {
      throw new UnauthorizedException('Invalid accessToken');
    }

    if (decodedToken.userId) {
      return this.validateUser(decodedToken.userId);
    }
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

  async getUserFromSocket(socket: Socket): Promise<UserEntity | IWSError> {
    const cookie = socket.handshake.headers.cookie;
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

    if (payload.userId) {
      return this.validateUser(payload.userId);
    }
  }

  getJwtAccessToken(userId: UserId): Token {
    const payload: TokenPayloadEntity = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      content: token,
      expiresIn: new Date(
        Date.now() + this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      ),
    };
  }

  getJwtRefreshToken(userId: UserId): Token {
    const payload: TokenPayloadEntity = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
    return {
      content: token,
      expiresIn: new Date(
        Date.now() +
          this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      ),
    };
  }
}
