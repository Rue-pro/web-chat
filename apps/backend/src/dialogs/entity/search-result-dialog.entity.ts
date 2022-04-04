import { DialogMessage, DialogUser } from './types';

export class SearchResultDialogEntity {
  user: DialogUser;
  message?: DialogMessage;

  constructor(user: DialogUser, message: DialogMessage) {
    this.user = user;
    if (message.id) this.message = message;
  }
}
