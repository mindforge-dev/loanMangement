"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const env_1 = require("./env");
const user_entity_1 = require("../modules/users/user.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: env_1.env.DB_HOST,
    port: parseInt(env_1.env.DB_PORT, 10),
    username: env_1.env.DB_USER,
    password: env_1.env.DB_PASS,
    database: env_1.env.DB_NAME,
    synchronize: env_1.env.NODE_ENV === 'development', // Option A: synchronize=true for dev only
    logging: env_1.env.NODE_ENV === 'development',
    entities: [user_entity_1.User], // Will add entities here
    migrations: [],
    subscribers: [],
});
