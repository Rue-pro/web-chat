import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { ConversationEntity } from '../conversations/entity';
import { ConnectionsModule } from '../connections/connections.module';
import { MessagesService } from '../messages/messages.service';
import { MessageEntity } from '../messages/entity';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, MessageEntity]),
    ConnectionsModule,
    AuthModule,
    ConversationsModule,
  ],
  providers: [SocketGateway, MessagesService],
})
export class SocketModule {}
