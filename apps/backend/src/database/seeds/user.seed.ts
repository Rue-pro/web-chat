import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from 'src/users/entity';

export default class UserSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await factory(UserEntity)().createMany(100);
  }
}
