import { Factory, Seeder } from 'typeorm-seeding';
import { Connection } from 'typeorm';
import { UserEntity } from 'src/users/entity/user.entity';

export default class InitialSeeder implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const usersCount = 10;
    const users = await connection.getRepository(UserEntity).find();

    if (!users.length) {
      await factory(UserEntity)().makeMany(usersCount);
    }

    for (let i = 0; i < usersCount; i++) {
      const user = await factory(UserEntity)().make();
      const em = connection.createEntityManager();
      em.save(restoreOldFieldsInNewObject(user, users[i]));
    }

    function restoreOldFieldsInNewObject(newObj, oldObj) {
      for (const [i, prop] of Object.entries(Object.entries(oldObj))) {
        const [key, value] = prop;
        if (newObj.hasOwnProperty(key)) {
          newObj[key] = value;
        }
        return newObj;
      }
    }
  }
}
