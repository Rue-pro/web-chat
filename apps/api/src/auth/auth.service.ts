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
    const users = await this.userRepository.find();
    console.log('USERS', users);
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

  validateUser(userId: UserId) {
    return this.usersService.findOne(userId);
  }

  async getUserFromToken(token: string): Promise<UserEntity> {
    console.log('TOKEN', token);
    const decodedToken = this.jwtService.decode(token);
    console.log('getUserFromAuthenticationToken TOKEN', decodedToken);
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
      console.log('VERIFICATION');
      console.log(this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'));
      console.log(accessToken);
      console.log(
        this.jwtService.verify(accessToken, {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        }),
      );
      const someResult = this.jwtService.verify;
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
      )}`,
    });

    let expiresIn = new Date();
    console.log('ACCESS_TOKEN start seconds', expiresIn.getSeconds());
    console.log(
      'ACCESS_TOKEN expiration time',
      this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );
    expiresIn.setSeconds(
      expiresIn.getSeconds() +
        this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    );

    return {
      content: token,
      expiresIn: expiresIn,
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
