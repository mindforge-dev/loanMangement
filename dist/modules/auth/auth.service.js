"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_repository_1 = require("../users/users.repository");
const jwt_1 = require("../../common/utils/jwt");
const http_errors_1 = require("../../common/errors/http-errors");
const user_entity_1 = require("../users/user.entity");
class AuthService {
    constructor() {
        this.userRepo = users_repository_1.userRepository;
    }
    async register(data) {
        const existingUser = await this.userRepo.findByEmail(data.email);
        if (existingUser) {
            throw new http_errors_1.BadRequestError('User already exists');
        }
        const hashedPassword = await bcrypt_1.default.hash(data.password, 10);
        const user = await this.userRepo.create({
            ...data,
            passwordHash: hashedPassword,
            role: data.role || user_entity_1.UserRole.LOAN_OFFICER,
        });
        const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
        // safe user object
        const { passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }
    async login(data) {
        const user = await this.userRepo.findByEmail(data.email);
        if (!user) {
            throw new http_errors_1.UnauthorizedError('Invalid credentials');
        }
        const isMatch = await bcrypt_1.default.compare(data.password, user.passwordHash);
        if (!isMatch) {
            throw new http_errors_1.UnauthorizedError('Invalid credentials');
        }
        const token = (0, jwt_1.signToken)({ userId: user.id, role: user.role });
        const { passwordHash, ...safeUser } = user;
        return { user: safeUser, token };
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
