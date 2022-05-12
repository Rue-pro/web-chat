import { define } from 'typeorm-seeding';
import { UserEntity } from '../../users/entity';

const { faker: Faker } = require('@faker-js/faker');

define(UserEntity, (faker: typeof Faker) => {
  const userData = {
    id: faker.random.uuid(),
    name: faker.name.findName(),
    createdAt: new Date(),
    updatedAt: new Date(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    password: faker.internet.password(),
    currentHashedRefreshToken: null,
    avatar: faker.helpers.randomize([faker.image.avatar(), null]),
  };

  let user = new UserEntity();
  user = Object.assign(user, userData);
  return user;
});
