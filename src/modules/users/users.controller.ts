import { Request, Response, NextFunction } from 'express';
import { userService } from './users.service';
import { NotFoundError } from '../../common/errors/http-errors';

export class UserController {
    async getMe(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.userId;
            const user = await userService.getUserById(userId);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            const { passwordHash, ...safeUser } = user;
            res.json({ data: safeUser });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await userService.getAllUsers();
            const safeUsers = users.map(u => {
                const { passwordHash, ...safe } = u;
                return safe;
            });
            res.json({ data: safeUsers });
        } catch (error) {
            next(error);
        }
    }
}

export const userController = new UserController();
