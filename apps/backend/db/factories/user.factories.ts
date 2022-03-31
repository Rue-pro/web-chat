import Faker from '@faker-js/faker';
import { UserEntity } from 'src/users/entity';
import { define } from 'typeorm-seeding';

define(UserEntity, (faker: typeof Faker) => {
  const userData = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password(),
    avatar: faker.image.avatar(),
    role: faker.helpers.randomize(['USER', 'ADMIN']),
  };

  const user = new UserEntity();
  Object.assign(user, userData);
  return user;
});
