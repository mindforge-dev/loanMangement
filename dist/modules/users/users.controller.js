"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = exports.UserController = void 0;
const users_service_1 = require("./users.service");
const http_errors_1 = require("../../common/errors/http-errors");
class UserController {
    async getMe(req, res, next) {
        try {
            const userId = req.user.userId;
            const user = await users_service_1.userService.getUserById(userId);
            if (!user) {
                throw new http_errors_1.NotFoundError('User not found');
            }
            const { passwordHash, ...safeUser } = user;
            res.json({ data: safeUser });
        }
        catch (error) {
            next(error);
        }
    }
    async getAll(req, res, next) {
        try {
            const users = await users_service_1.userService.getAllUsers();
            const safeUsers = users.map(u => {
                const { passwordHash, ...safe } = u;
                return safe;
            });
            res.json({ data: safeUsers });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.UserController = UserController;
exports.userController = new UserController();
