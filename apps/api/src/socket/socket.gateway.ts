import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionsService } from '../connections/connections.service';
import { ConversationsService } from '../conversations/conversations.service';
import { IWSError } from '../error/ws.error.interface';
import { MessagesService } from '../messages/messages.service';
import { NewMessageDto } from '../messages/dto';
import { TokenService } from 'src/auth/token.service';
import { ConversationId } from 'src/conversations/entity';

@WebSocketGateway({
  path: `/socket`,
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessagesService,
    private readonly conversationService: ConversationsService,
    private readonly connectionService: ConnectionsService,
    private readonly tokenService: TokenService,
  ) {}

  private logger: Logger = new Logger('SocketGateway');

  handleDisconnect(socket: Socket) {
    this.connectionService.delete(socket.id);

    /**
     * Уведомить всех друзей об оффлайне
     */
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      const user = await this.tokenService.getUserFromSocket(socket);

      await this.connectionService.create({
        userId: user.id,
        socketId: socket.id,
      });
    } catch (e) {}
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() newMessage: NewMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('SEND_MESSAGE');
    console.log(newMessage);
    try {
      const user = await this.tokenService.getUserFromSocket(socket);
      const userId = user.id;

      let conversation = null;

      if (newMessage.currentDialog.type === 'NEW_DIALOG') {
        conversation = await this.conversationService.createConversation(
          userId,
          newMessage.currentDialog.id,
        );
      }

      if (newMessage.currentDialog.type === 'EXISTING_DIALOG') {
        conversation = await this.conversationService.findOne(
          newMessage.currentDialog.id,
        );
      }

      const message = await this.messageService.saveMessage({
        authorId: userId,
        conversationId: conversation.id,
        content: newMessage.content,
      });

      const receivers = [socket.id];
      const connection = await this.connectionService.findOne(
        conversation.user1 === userId ? conversation.user2 : conversation.user1,
      );
      if (connection) receivers.push(connection.socketId);
      console.log('DO RECEIVE MESSAGES');
      console.log(receivers);
      this.server.sockets.to(receivers).emit('receive_message', {
        id: message.id,
        content: newMessage.content,
        createdAt: message.createdAt,
        authorId: userId,
        receiverId:
          newMessage.currentDialog.type === 'EXISTING_DIALOG'
            ? undefined
            : newMessage.currentDialog.id,
        conversationId: conversation.id,
      });
    } catch (e) {
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        e.query = {
          event: 'send_message',
          payload: newMessage,
        };
        socket.emit('error', e);
        return;
      }
    }
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @MessageBody() conversationId: ConversationId,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const user = await this.tokenService.getUserFromSocket(socket);
      const messages = await this.messageService.getAllMessages(
        user.id,
        conversationId,
      );

      socket.emit('send_all_messages', messages);
    } catch (e) {
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        e.query = {
          event: 'request_all_messages',
          payload: conversationId,
        };
        socket.emit('error', e);
        return;
      }
    }
  }

  @SubscribeMessage('request_all_dialogs')
  async requestAllDialogs(@ConnectedSocket() socket: Socket) {
    try {
      console.log('REQUEST_ALL_DIALOGS');
      const user = await this.tokenService.getUserFromSocket(socket);

      const dialogs = await this.conversationService.findAll(user.id);
      console.log(dialogs);
      socket.emit('send_all_dialogs', dialogs);
    } catch (e) {
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        e.query = { event: 'request_all_dialogs' };
        socket.emit('error', e);
        return;
      }
    }
  }
}
