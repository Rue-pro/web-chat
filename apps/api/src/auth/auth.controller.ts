import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';

import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';
import { Token } from './entity';
import { TokenService } from './token.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
    private readonly userService: UsersService,
  ) {}

  private setupAuthTokensCookie(
    reply: FastifyReply,
    request: FastifyRequest,
    accessToken: Token,
    refreshToken: Token,
  ): FastifyReply {
    const origin = request.headers.origin;

    const indexOfDomain = origin.indexOf(':') + 3;
    let domain = origin.includes('localhost')
      ? 'localhost'
      : origin.slice(indexOfDomain);

    console.log('DOMAIN', domain);

    return reply
      .setCookie('access_token', accessToken.content, {
        domain: domain,
        path: '/',
        httpOnly: false,
        expires: accessToken.expiresIn,
        secure: true,
        sameSite: 'none',
      })
      .setCookie('refresh_token', refreshToken.content, {
        domain: domain,
        path: '/',
        httpOnly: false,
        expires: refreshToken.expiresIn,
        secure: true,
        sameSite: 'none',
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
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

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

    newReply.send({
      accessToken: {
        expiresIn: accessToken.expiresIn,
      },
      refreshToken: {
        expiresIn: refreshToken.expiresIn,
      },
    });
  }

  @Get('logout')
  async logout(@Res() reply: FastifyReply, @Req() request: FastifyRequest) {
    const user = await this.tokenService.getUserFromToken(
      request.cookies.access_token,
    );
    await this.userService.removeRefeshToken(user.id);
    reply.clearCookie('access_token').clearCookie('refresh_token').send({
      success: true,
    });
  }

  @Get('refresh')
  async refresh(@Res() reply: FastifyReply, @Req() request: FastifyRequest) {
    const user = await this.tokenService.getUserFromToken(
      request.cookies.refresh_token,
    );
    const accessToken = await this.tokenService.generateAccessToken(user.id);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(
      refreshToken.content,
      user.id,
    );

    this.setupAuthTokensCookie(reply, request, accessToken, refreshToken).send({
      accessToken: {
        expiresIn: accessToken.expiresIn,
      },
      refreshToken: {
        expiresIn: refreshToken.expiresIn,
      },
    });
  }
}
