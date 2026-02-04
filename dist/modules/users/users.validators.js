"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
const user_entity_1 = require("./user.entity");
exports.CreateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        email: zod_1.z.string().email(),
        password: zod_1.z.string().min(6),
        role: zod_1.z.nativeEnum(user_entity_1.UserRole).optional(),
    }),
});
exports.LoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email(),
        password: zod_1.z.string(),
    }),
});
