import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() { email, password }: LoginDto,
    @Res() reply: FastifyReply,
  ) {
    console.log('LOGIN', email, password);
    const { accessToken } = await this.authService.login(email, password);
    console.log('ACCESS_TOKEN', accessToken);
    reply
      .setCookie('access_token', accessToken, {
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      })
      .send({ success: true });
  }
}
