import { AuthService } from 'src/auth/auth.service';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  MessageBody,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { Logger, UseFilters, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';

import { ConnectionsService } from 'src/connections/connections.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { MessagesService } from './messages.service';
import { CreateMessageDto, NewMessageDto } from './dto';
import { IWSError } from 'src/error/ws.error.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@WebSocketGateway({
  path: '/messages',
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessagesService,
    private readonly dialogService: DialogsService,
    private readonly connectionService: ConnectionsService,
    private readonly authService: AuthService,
  ) {}

  private logger: Logger = new Logger('AppGateway');

  handleDisconnect(socket: Socket) {
    this.connectionService.delete(socket.id);

    /**
     * Уведомить всех друзей об оффлайне
     */
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);
    console.log(`Client connected: ${socket.id}`);

    const result = await this.authService.getUserFromSocket(socket);
    if (result instanceof IWSError) {
      return;
    }

    await this.connectionService.create({
      userId: result.id,
      socketId: socket.id,
    });

    /**
     * Уведомить всех друзей об онлайне
     */
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() newMessage: NewMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const receiverId = '6b538db0-e48c-4ee0-a2ee-8fe59e7840ce';
    const result = await this.authService.getUserFromSocket(socket);

    if (result instanceof IWSError) {
      socket.emit('error', result);
      return;
    }
    console.log('NEW_MESSAGE', newMessage);
    const conversationId = newMessage.dialogId;

    let conversation = await this.dialogService.findOne(conversationId);

    console.log('FINDED_CONVERSATION', conversation);

    if (!conversation) {
      conversation = await this.dialogService.createConversation(
        result.id,
        receiverId,
      );
      /**
       * Уведомляем сокет о создании связи
       */
      socket.emit('receive_created_dialog', conversation.id);
    }

    console.log('CONVERSATION', conversation);

    const message = await this.messageService.saveMessage({
      authorId: result.id,
      channelId: conversationId,
      content: newMessage.content,
    });

    const receivers = [socket.id];
    const connection = await this.connectionService.findOne(
      conversation.user1 === result.id
        ? conversation.user2
        : conversation.user1,
    );
    console.log('CONNECTION', connection);
    if (connection) receivers.push(connection.socketId);

    console.log('Получатели', receivers);

    this.server.sockets.to(receivers).emit('receive_message', {
      id: message.id,
      content: newMessage.content,
      createdAt: message.createdAt,
      authorId: result.id,
      dialogId: conversation.id,
    });
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @MessageBody() dialogId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const result = await this.authService.getUserFromSocket(socket);

    if (result instanceof IWSError) {
      socket.emit('error', result);
      return;
    }

    const messages = await this.messageService.getAllMessages(
      result.id,
      dialogId,
    );

    socket.emit('send_all_messages', messages);
  }

  @SubscribeMessage('request_all_dialogs')
  async requestAllDialogs(@ConnectedSocket() socket: Socket) {
    const result = await this.authService.getUserFromSocket(socket);

    if (result instanceof IWSError) {
      console.log('ERROR');
      socket.emit('error', result);
      return;
    }

    const dialogs = await this.dialogService.findAll(result.id);
    console.log('REQUEST_ALL_DIALOGS', dialogs);
    socket.emit('send_all_dialogs', dialogs);
  }
}
