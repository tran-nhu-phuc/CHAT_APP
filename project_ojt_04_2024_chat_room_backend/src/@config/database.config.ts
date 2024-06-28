import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

dotenvConfig();

const options = {
  type: 'mysql',
  host: `${process.env.DB_HOST || '127.0.0.1'}`,
  port: `${process.env.DB_PORT || 3307}`,
  username: `${process.env.DB_USER || 'rikkei'}`,
  password: `${process.env.DB_PASSWORD || 'Password123'}`,
  database: `${process.env.DB_NAME || 'dn1_ra_202311'}`,
  entities: [`${__dirname}../**/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/../../database/migrations/*.{ts,js}`],
  autoLoadEntities: true,
  synchronize: false,
};

export default TypeOrmModule.forRoot(options as TypeOrmModuleOptions);

export const connectionSource = new DataSource(options as DataSourceOptions);
