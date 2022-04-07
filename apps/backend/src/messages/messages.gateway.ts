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

import { ConnectionsService } from './../connections/connections.service';
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
    const receiverId = newMessage.receiverId;

    const message = await this.messageService.saveMessage({
      authorId: user.id,
      receiverId: receiverId,
      content: newMessage.content,
    });

    const connection = await this.connectionService.findOne(receiverId);
    const receivers = [socket.id];
    if (connection) receivers.push(connection.socketId);

    console.log('Получатели', receivers);

    this.server.sockets.to(receivers).emit('receive_message', {
      id: message.id,
      content: newMessage.content,
      createdAt: message.createdAt,
      authorId: user.id,
      receiverId: receiverId,
    });

    return message;
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
}
