import { DialogMessage, DialogUser } from './types';

export class DialogEntity {
  user: DialogUser;
  message: DialogMessage;

  constructor(user: DialogUser, message?: DialogMessage) {
    (this.user = user), (this.message = message);
  }
}
