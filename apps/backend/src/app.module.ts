import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesGateway } from './messages/messages.gateway';

const environment = process.env.NODE_END || 'development';
@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [MessagesGateway],
})
export class AppModule {}
