import { AuthService } from 'src/auth/auth.service';
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

import { ConnectionsService } from 'src/connections/connections.service';
import { DialogsService } from 'src/dialogs/dialogs.service';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';

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
  private connections = [];

  handleDisconnect(socket: Socket) {
    this.connectionService.delete(socket.id);

    /**
     * Уведомить всех друзей об оффлайне
     */
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${socket.id}`);
    console.log(`Client connected: ${socket.id}`);

    const user = await this.authService.getUserFromSocket(socket);

    await this.connectionService.create({
      userId: user.id,
      socketId: socket.id,
    });

    /**
     * Уведомить всех друзей об онлайне
     */
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() newMessage: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromSocket(socket);
    const channelId = newMessage.channelId;

    const conversation = await this.dialogService.createConversation(
      user.id,
      channelId,
    );

    console.log('CONVERSATION', conversation);

    const message = await this.messageService.saveMessage({
      authorId: user.id,
      channelId: conversation.id,
      content: newMessage.content,
    });

    const connection = await this.connectionService.findOne(channelId);
    const receivers = [socket.id];
    if (connection) receivers.push(connection.socketId);

    console.log('Получатели', receivers);

    this.server.sockets.to(receivers).emit('receive_message', {
      id: message.id,
      content: newMessage.content,
      createdAt: message.createdAt,
      authorId: user.id,
      receiverId: channelId,
    });

    const dialogs = [];

    this.server.sockets.to(receivers).emit('send_all_dialogs', dialogs);
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @MessageBody() dialogId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromSocket(socket);
    const messages = await this.messageService.getAllMessages(
      user.id,
      dialogId,
    );

    socket.emit('send_all_messages', messages);
  }

  @SubscribeMessage('request_all_dialogs')
  async requestAllDialogs(
    @MessageBody() dialogId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.authService.getUserFromSocket(socket);
    const dialogs = await this.dialogService.findAll(user.id);

    socket.emit('send_all_dialogs', dialogs);
  }
}
