"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.string().default('3000'),
    DB_HOST: zod_1.z.string(),
    DB_PORT: zod_1.z.string().default('3306'),
    DB_USER: zod_1.z.string(),
    DB_PASS: zod_1.z.string(),
    DB_NAME: zod_1.z.string(),
    JWT_SECRET: zod_1.z.string(),
    JWT_EXPIRES_IN: zod_1.z.string().default('1d'),
});
const _env = envSchema.safeParse(process.env);
if (!_env.success) {
    console.error('INVALID ENVIRONMENT VARIABLES:', _env.error.format());
    process.exit(1);
}
exports.env = _env.data;
