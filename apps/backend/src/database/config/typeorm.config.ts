import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: 'postgres://user:password@localhost:35000/db',
  entities: [join('**/*.entity{.ts,.js}')],
  migrationsRun: false,
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  synchronize: true,
  cli: {
    migrationsDir: join('src', 'database', 'migrations'),
  },
};

module.exports = typeOrmConfig;
