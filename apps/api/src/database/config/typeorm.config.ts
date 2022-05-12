import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { UserEntity } from 'src/users/entity';

const isProd = process.env.DATABASE_URL;

const DATABASE_USER = process.env.POSTGRES_USER;
const DATABASE_PASSWORD = process.env.POSTGRES_PASSWORD;
const DATABASE_HOST = process.env.POSTGRES_HOST;
const DATABASE_PORT = +process.env.POSTGRES_PORT;
const DATABASE_DB = process.env.POSTGRES_DB;

const DATABASE_URL = isProd
  ? process.env.DATABASE_URL
  : `postgres://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_DB}`;

export const typeormConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: DATABASE_URL,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsTableName: 'migration',
  migrations: ['src/database/migrations/*.js'],
  ssl: isProd
    ? {
        rejectUnauthorized: false,
      }
    : false,
};
module.exports = typeormConfig;
