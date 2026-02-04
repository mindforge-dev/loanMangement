"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const http_errors_1 = require("../errors/http-errors");
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new http_errors_1.ForbiddenError('Access denied: Insufficient permissions'));
        }
        next();
    };
};
exports.authorize = authorize;
