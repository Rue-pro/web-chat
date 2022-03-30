import faker from '@faker-js/faker';
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.info('Delete users data');
  await prisma.user.deleteMany();

  console.info('Add users data');
  for (let i = 0; i < 100; i++) {
    await prisma.user.create({
      data: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        phone: faker.phone.phoneNumber(),
        password: faker.internet.password(),
        avatar: faker.image.avatar(),
        role: faker.helpers.randomize(Object.values(Role)),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
