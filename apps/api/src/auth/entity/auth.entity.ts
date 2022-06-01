import { UserEntity } from 'src/users/entity';

export class AuthEntity {
  accessToken: {
    expiresIn: Date;
  };
  refreshToken: {
    expiresIn: Date;
  };
  user: UserEntity;
}
