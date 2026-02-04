import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../modules/users/user.entity';

export const AppDataSource = new DataSource(
    env.NODE_ENV === 'test'
        ? {
            type: 'sqlite',
            database: ':memory:',
            synchronize: true,
            dropSchema: true,
            entities: [User],
            logging: false,
        }
        : {
            type: 'mysql',
            host: env.DB_HOST,
            port: parseInt(env.DB_PORT, 10),
            username: env.DB_USER,
            password: env.DB_PASS,
            database: env.DB_NAME,
            synchronize: env.NODE_ENV === 'development',
            logging: env.NODE_ENV === 'development',
            entities: [User],
            migrations: [],
            subscribers: [],
        }
);
