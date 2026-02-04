"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.UserService = void 0;
const users_repository_1 = require("./users.repository");
class UserService {
    constructor() {
        this.userRepo = users_repository_1.userRepository;
    }
    async getUserById(id) {
        return this.userRepo.findById(id);
    }
    async getAllUsers() {
        return this.userRepo.findAll();
    }
}
exports.UserService = UserService;
exports.userService = new UserService();
