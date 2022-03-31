export class CreateUserDto {
  name: string;

  email: string;

  phone: string;

  password: string;

  avatar?: string;

  role: 'USER' | 'ADMIN';
}
