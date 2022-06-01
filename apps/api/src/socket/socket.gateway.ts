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
      const result = await this.tokenService.getUserFromSocket(socket);

      await this.connectionService.create({
        userId: result.id,
        socketId: socket.id,
      });
    } catch (e) {
      console.log(e);
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        return;
      }
    }
  }

  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() newMessage: NewMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('SEND_MESSAGE');
    console.log(newMessage);
    try {
      const result = await this.tokenService.getUserFromSocket(socket);

      let conversation = null;

      if (newMessage.currentDialog.type === 'NEW_DIALOG') {
        conversation = await this.dialogService.createConversation(
          result.id,
          newMessage.currentDialog.id,
        );
      }

      if (newMessage.currentDialog.type === 'EXISTING_DIALOG') {
        conversation = await this.dialogService.findOne(
          newMessage.currentDialog.id,
        );
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
      console.log('DO RECEIVE MESSAGES');
      console.log(receivers);
      this.server.sockets.to(receivers).emit('receive_message', {
        id: message.id,
        content: newMessage.content,
        createdAt: message.createdAt,
        authorId: result.id,
        receriverId: newMessage.currentDialog.id,
        dialogId: conversation.id,
      });
    } catch (e) {
      console.log(e.name);
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        const result = {
          event: 'send_message',
          payload: newMessage,
        };
        socket.emit('error', result);
        return;
      }
    }
  }

  @SubscribeMessage('request_all_messages')
  async requestAllMessages(
    @MessageBody() dialogId: string,
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const result = await this.tokenService.getUserFromSocket(socket);
      const messages = await this.messageService.getAllMessages(
        result.id,
        dialogId,
      );

      socket.emit('send_all_messages', messages);
    } catch (e) {
      console.log(e);
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        const result = {
          event: 'request_all_messages',
          payload: dialogId,
        };
        socket.emit('error', result);
        return;
      }
    }
  }

  @SubscribeMessage('request_all_dialogs')
  async requestAllDialogs(@ConnectedSocket() socket: Socket) {
    try {
      console.log('REQUEST_ALL_DIALOGS');
      const result = await this.tokenService.getUserFromSocket(socket);

      const dialogs = await this.dialogService.findAll(result.id);
      console.log(dialogs);
      socket.emit('send_all_dialogs', dialogs);
    } catch (e) {
      console.log(e);
      if (e instanceof IWSError || e.name === 'TokenExpiredError') {
        const result = { event: 'request_all_dialogs' };
        socket.emit('error', result);
        return;
      }
    }
  }
}
