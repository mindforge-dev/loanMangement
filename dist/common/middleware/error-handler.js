"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const app_error_1 = require("../errors/app-error");
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            error: {
                type: 'VALIDATION_ERROR',
                message: 'Invalid request',
                details: err.errors.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                })),
            },
        });
    }
    if (err instanceof app_error_1.AppError) {
        return res.status(err.statusCode).json({
            error: {
                type: err.constructor.name.replace(/Error$/, '').toUpperCase(),
                message: err.message,
            },
        });
    }
    return res.status(500).json({
        error: {
            type: 'INTERNAL_SERVER_ERROR',
            message: 'Something went wrong',
        },
    });
};
exports.errorHandler = errorHandler;
