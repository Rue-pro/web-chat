import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { DialogsModule } from './dialogs/dialogs.module';
import { ConnectionsModule } from './connections/connections.module';
import { typeormConfig } from './database/config/typeorm.config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../web', 'build'),
    }),
    ConfigModule.forRoot({
      envFilePath: `.env`,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeormConfig),
    AuthModule,
    UsersModule,
    DialogsModule,
    MessagesModule,
    ConnectionsModule,
  ],
})
export class AppModule {}
