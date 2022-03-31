import faker from '@faker-js/faker';

export const UsersSeed = () => {
  const users = [];
  for (let i = 0; i < 100; i++) {
    users.push({
      name: faker.name.findName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber(),
      password: faker.internet.password(),
      avatar: faker.image.avatar(),
      role: faker.helpers.randomize(['USER', 'ADMIN']),
    });
  }
  return users;
};
