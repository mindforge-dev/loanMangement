import { Request, Response, NextFunction } from 'express';
import { userService } from './users.service';
import { NotFoundError } from '../../common/errors/http-errors';
import { BaseController } from '../../common/base/baseController';
import { User } from './user.entity';

export class UserController extends BaseController<User> {
    constructor() {
        super(userService);
    }

    // Override or add specific methods
    getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user!.userId;
            const user = await this.service.findById(userId);

            if (!user) {
                throw new NotFoundError('User not found');
            }

            const { passwordHash, ...safeUser } = user;
            res.json({ data: safeUser });
        } catch (error) {
            next(error);
        }
    };

    // Override getAll to apply safety filter
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.service.findAll();
            const safeUsers = users.map(u => {
                const { passwordHash, ...safe } = u;
                return safe;
            });
            res.json({ data: safeUsers });
        } catch (error) {
            next(error);
        }
    };
}

export const userController = new UserController();
