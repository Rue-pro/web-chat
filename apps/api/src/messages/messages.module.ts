import { ConnectionsService } from './../connections/connections.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { DialogsModule } from 'src/dialogs/dialogs.module';
import { ConversationEntity } from 'src/dialogs/entity';
import { ConnectionsModule } from 'src/connections/connections.module';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    ConnectionsModule,
    AuthModule,
    DialogsModule,
  ],
  providers: [MessagesService],
})
export class MessagesModule {}
