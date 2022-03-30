import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import typeOrmConfig from 'typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

const environment = process.env.NODE_END || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${environment}`,
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
    TypeOrmModule.forRoot(typeOrmConfig),
  ],
})
export class AppModule {}
