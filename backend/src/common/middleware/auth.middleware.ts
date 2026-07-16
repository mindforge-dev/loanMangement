/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError } from '../errors/http-errors';
import { authService } from '../../modules/auth/auth.service';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new UnauthorizedError('Missing or invalid authorization header'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = verifyAccessToken(token);
        const user = await authService.getUserWithPermissions(payload.sub);
        if (!user) {
            return next(new UnauthorizedError('User not found'));
        }
        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedError('Invalid or expired token'));
    }
};
