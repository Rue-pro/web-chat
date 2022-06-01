type NewDialog = {
  type: 'NEW_DIALOG';
  id: string;
};

type ExistingDialog = {
  type: 'EXISTING_DIALOG';
  id: number;
};
export class NewMessageDto {
  content: string;

  currentDialog: NewDialog | ExistingDialog;
}
