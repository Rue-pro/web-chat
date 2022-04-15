import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
require('dotenv').config();

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const port = process.env.POSTGRES_PORT;
const db = process.env.POSTGRES_DB;

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: `postgres://${user}:${password}@localhost:${port}/${db}`,
  entities: [join('**/*.entity{.ts,.js}')],
  migrationsRun: false,
  logging: true,
  autoLoadEntities: true,
  synchronize: true,
  ssl: false,
  cli: {
    entitiesDir: 'src/**/*.entity{.ts}',
  },
};

export = typeOrmConfig;
