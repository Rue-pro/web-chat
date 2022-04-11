import { ConnectionsService } from './../connections/connections.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { ConnectionsModule } from 'src/connections/connections.module';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MessageEntity } from './entity';
import { DialogsModule } from 'src/dialogs/dialogs.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    ConnectionsModule,
    AuthModule,
    DialogsModule,
  ],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
