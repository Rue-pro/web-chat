import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UserId } from 'src/users/entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Token } from './entity';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  private setupAuthTokensCookie(
    reply: FastifyReply,
    request: FastifyRequest,
    accessToken: Token,
    refreshToken: Token,
  ): FastifyReply {
    const origin = request.headers.origin;

    const indexOfDomain = origin.indexOf(':') + 3;
    const indexOfPort = origin.slice(indexOfDomain).lastIndexOf(':');
    let domain = origin.includes('localhost') ? 'localhost' : origin;

    console.log('REQUEST', request);
    console.log('DOMAIN', domain);
    return reply
      .setCookie('access_token', accessToken.content, {
        domain: domain,
        path: '/',
        httpOnly: true,
        expires: accessToken.expiresIn,
      })
      .setCookie('refresh_token', refreshToken.content, {
        domain: domain,
        path: '/',
        httpOnly: true,
        expires: refreshToken.expiresIn,
      });
  }

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res() reply: FastifyReply,
    @Req() request: FastifyRequest,
  ) {
    const user = await this.authService.getUserForEmailAndPassword(
      email,
      password,
    );
    const accessToken = await this.authService.getJwtAccessToken(user.id);
    const refreshToken = await this.authService.getJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(
      refreshToken.content,
      user.id,
    );

    const newReply = this.setupAuthTokensCookie(
      reply,
      request,
      accessToken,
      refreshToken,
    );
    console.log(newReply);
    newReply.send(user);
  }

  @Get('logout')
  async logout(@Res() reply: FastifyReply, @Req() request: FastifyRequest) {
    const user = await this.authService.getUserFromAuthenticationToken(
      request.cookies.access_token,
    );
    await this.userService.removeRefeshToken(user.id);
    reply.clearCookie('access_token').clearCookie('refresh_token').send({
      success: true,
    });
  }

  @Get('refresh')
  async refresh(@Res() reply: FastifyReply, @Req() request: FastifyRequest) {
    const user = await this.authService.getUserFromAuthenticationToken(
      request.cookies.access_token,
    );
    const accessToken = this.authService.getJwtAccessToken(user.id);
    const refreshToken = this.authService.getJwtRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(
      refreshToken.content,
      user.id,
    );

    this.setupAuthTokensCookie(reply, request, accessToken, refreshToken).send(
      user,
    );
  }
}
