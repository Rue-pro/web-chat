import { SocketId } from 'src/socket/types';
import { UserId } from 'src/users/entity';

export class UpdateConnectionDto {
  userId: UserId;

  socketId: SocketId;
}
