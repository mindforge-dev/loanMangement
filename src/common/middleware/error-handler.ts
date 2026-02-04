import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/app-error';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof ZodError) {
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

    if (err instanceof AppError) {
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
