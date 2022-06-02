import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ConnectionsModule } from './connections/connections.module';
import { typeormConfig } from './database/config/typeorm.config';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../web', 'build'),
      exclude: ['/api*'],
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    SocketModule,
    UsersModule,
    ConversationsModule,
    MessagesModule,
    ConnectionsModule,
  ],
})
export class AppModule {}
