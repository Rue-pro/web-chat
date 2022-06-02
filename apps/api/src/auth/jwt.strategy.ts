import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';

import { TokenService } from './token.service';
import { UserEntity, UserId } from 'src/users/entity';

const cookieExtractor = (req) => {
  let jwt = null;

  if (req && req.cookies) {
    jwt = req.cookies['access_token'];
  }

  return jwt;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(payload: { userId: UserId }): Promise<UserEntity> {
    const user = await this.tokenService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
