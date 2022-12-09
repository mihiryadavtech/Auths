import { DataSource } from 'typeorm';
import { Basic } from './entities/Basic.entitiy';
import { User } from './entities/UserJwt.entitiy';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Basic],
  logging: false,
  synchronize: true,
});
export { AppDataSource };
