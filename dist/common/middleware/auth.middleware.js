"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const http_errors_1 = require("../errors/http-errors");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new http_errors_1.UnauthorizedError('Missing or invalid authorization header'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        next(new http_errors_1.UnauthorizedError('Invalid or expired token'));
    }
};
exports.authenticate = authenticate;
