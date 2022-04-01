import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';

const environment = process.env.NODE_END || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: false,
      autoLoadEntities: true,
      synchronize: true,
      ssl: false,
    }),
    AuthModule,
    UsersModule,
    MessagesModule,
  ],
})
export class AppModule {}
