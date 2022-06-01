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

import { AuthService } from '../auth/auth.service';
import { ConnectionsService } from '../connections/connections.service';
import { DialogsService } from '../dialogs/dialogs.service';
import { IWSError } from '../error/ws.error.interface';
import { MessagesService } from '../messages/messages.service';
import { NewMessageDto } from '../messages/dto';
import { TokenService } from 'src/auth/token.service';

@WebSocketGateway({
  path: `/socket`,
})
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly messageService: MessagesService,
    private readonly dialogService: DialogsService,
    private readonly connectionService: ConnectionsService,
    private readonly authService: AuthService,
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
    const result = await this.tokenService.getUserFromSocket(socket);
    if (result instanceof IWSError) {
      result.event = 'connect';
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
    const receiverId = newMessage.receiverId;
    const result = await this.tokenService.getUserFromSocket(socket);

    if (result instanceof IWSError) {
      result.event = 'send_message';
      result.payload = newMessage;
      socket.emit('error', result);
      return;
    }
    const conversationId = newMessage.dialogId;

    let conversation = await this.dialogService.findOne(conversationId);

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

    const message = await this.messageService.saveMessage({
      authorId: result.id,
      channelId: conversation.id,
      content: newMessage.content,
    });

    const receivers = [socket.id];
    const connection = await this.connectionService.findOne(
      conversation.user1 === result.id
        ? conversation.user2
        : conversation.user1,
    );
    if (connection) receivers.push(connection.socketId);

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
    const result = await this.tokenService.getUserFromSocket(socket);

    if (result instanceof IWSError) {
      result.event = 'request_all_messages';
      result.payload = dialogId;
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
    const result = await this.tokenService.getUserFromSocket(socket);
    if (result instanceof IWSError) {
      result.event = 'request_all_dialogs';
      socket.emit('error', result);
      return;
    }

    const dialogs = await this.dialogService.findAll(result.id);
    socket.emit('send_all_dialogs', dialogs);
  }
}
