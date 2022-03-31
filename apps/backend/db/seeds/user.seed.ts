import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from 'src/users/entity';
import faker from '@faker-js/faker';

export default class CreateUsers implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into(UserEntity)
      .values([
        {
          name: faker.name.findName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          password: faker.internet.password(),
          avatar: faker.image.avatar(),
          role: faker.helpers.randomize(['USER', 'ADMIN']),
        },
      ])
      .execute();
  }
}
