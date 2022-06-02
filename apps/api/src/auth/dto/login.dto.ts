import { UserEmail, UserPassword } from 'src/users/entity';

export class LoginDto {
  email: UserEmail;

  password: UserPassword;
}
