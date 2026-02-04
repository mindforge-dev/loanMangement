
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../errors/http-errors';

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ForbiddenError('Access denied: Insufficient permissions'));
        }
        next();
    };
};
