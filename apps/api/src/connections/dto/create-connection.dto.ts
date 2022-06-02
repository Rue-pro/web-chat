import { SocketId } from 'src/socket/types';
import { UserId } from 'src/users/entity';

export class CreateConnectionDto {
  userId: UserId;

  socketId: SocketId;
}
