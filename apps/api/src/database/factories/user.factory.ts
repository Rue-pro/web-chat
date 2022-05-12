import Faker from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { UserEntity } from '../../users/entity';

define(UserEntity, (faker: typeof Faker) => {
  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    role: faker.helpers.randomize(['USER', 'ADMIN']),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let user = new UserEntity();
  user = Object.assign(user, userData);
  return user;
});
