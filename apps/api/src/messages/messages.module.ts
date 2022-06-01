import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from 'src/auth/auth.module';
import { ConversationsModule } from 'src/conversations/conversations.module';
import { ConversationEntity } from 'src/conversations/entity';
import { ConnectionsModule } from 'src/connections/connections.module';
import { MessagesService } from './messages.service';
import { MessageEntity } from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    ConnectionsModule,
    AuthModule,
    ConversationsModule,
  ],
  providers: [MessagesService],
})
export class MessagesModule {}
