import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ENV } from './env.config';
import { config } from 'dotenv';

config();

export default new DataSource({
  type: 'postgres',
  host: ENV.DATABASE.HOST,
  port: ENV.DATABASE.PORT,
  username: ENV.DATABASE.USERNAME,
  password: ENV.DATABASE.PASSWORD,
  database: ENV.DATABASE.DATABASE,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  logging: true,
  synchronize: false,
});

@Injectable()
export class PostgresConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: ENV.DATABASE.HOST,
      port: ENV.DATABASE.PORT,
      username: ENV.DATABASE.USERNAME,
      password: ENV.DATABASE.PASSWORD,
      database: ENV.DATABASE.DATABASE,

      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],

      logging: true,
      logger: 'advanced-console',
      synchronize: false,
    };
  }
}
