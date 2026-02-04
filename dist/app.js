"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = require("./common/middleware/error-handler");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
exports.app = (0, express_1.default)();
// Middleware
exports.app.use((0, helmet_1.default)());
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
// Routes
exports.app.use('/auth', auth_routes_1.default);
exports.app.use('/users', users_routes_1.default);
// Root Endpoint
exports.app.get('/', (req, res) => {
    res.json({ message: 'Loan Management API is running' });
});
// Error Handler
exports.app.use(error_handler_1.errorHandler);
