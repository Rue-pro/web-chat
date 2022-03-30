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
import { MessagesService } from './messages.service';

@WebSocketGateway({
  path: '/messages',
})
export class MessagesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly messageService: MessagesService) {}

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.logger.log('Init');
    console.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    console.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    console.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() content: string,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('LISTEN FOR MESSAGES');
    console.log(socket);

    /**
     * TODO
     * Получение автора сообщения из jwt токена
     */
    const authorId = 'cl10bf6sg000497l4lfivj7k7';
    const message = await this.messageService.saveMessage({
      authorId,
      content,
    });

    this.server.sockets.emit('receive_message', {
      authorId,
      content,
    });

    return message;
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(@ConnectedSocket() socket: Socket) {
    console.log('--------REQUEST_ALL_MESSAGES---------');
    const user = await this.messageService.getUserFromSocket(socket);
    const messages = await this.messageService.getAllMessages(user.id);
    socket.emit('send_all_messages', messages);
  }
}
