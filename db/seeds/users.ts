import { Role } from '@prisma/client';
import faker from '@faker-js/faker';

export const users = [
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: 'qedq',
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    role: Role.DEVELOPER,
  },
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: 'qedq2',
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    role: Role.ADMIN,
  },
];
