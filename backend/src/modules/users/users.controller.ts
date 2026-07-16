import { Request, Response, NextFunction } from 'express';
import { userService } from './users.service';
import { authService } from '../auth/auth.service';
import { NotFoundError, BadRequestError } from '../../common/errors/http-errors';
import { BaseController } from '../../common/base/baseController';
import { User } from './user.entity';

export class UserController extends BaseController<User> {
    constructor() {
        super(userService);
    }

    getMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // `req.user` is already the fresh, permission-loaded principal
            if (!req.user) {
                throw new NotFoundError('User not found');
            }
            res.json({ data: req.user });
        } catch (error) {
            next(error);
        }
    };

    // Override getAll to strip password hashes and flatten roles/permissions to name arrays
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await userService.findAllWithRelations();
            const safeUsers = users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                createdAt: u.createdAt,
                roles: (u.roles ?? []).map((r) => r.name),
                permissions: (u.permissions ?? []).map((p) => p.name),
            }));
            res.json({ data: safeUsers });
        } catch (error) {
            next(error);
        }
    };

    mePermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user) throw new NotFoundError('User not found');
            res.json({
                data: {
                    roles: req.user.roles,
                    permissions: req.user.permissions,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    listRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const roles = await authService.getAllRoles();
            res.json({ data: roles });
        } catch (error) {
            next(error);
        }
    };

    listPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permissions = await authService.getAllPermissions();
            res.json({ data: permissions });
        } catch (error) {
            next(error);
        }
    };

    assignRoles = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { roles } = req.body;
            if (!Array.isArray(roles)) {
                throw new BadRequestError('`roles` must be an array of role names');
            }
            const user = await authService.assignRoles(id, roles);
            res.json({ data: user });
        } catch (error) {
            next(error);
        }
    };

    syncPermissions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { permissions } = req.body;
            if (!Array.isArray(permissions)) {
                throw new BadRequestError('`permissions` must be an array of permission names');
            }
            const user = await authService.syncPermissions(id, permissions);
            res.json({ data: user });
        } catch (error) {
            next(error);
        }
    };
}

export const userController = new UserController();
