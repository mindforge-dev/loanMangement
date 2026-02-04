import { Router } from 'express';
import { authenticate } from '../../common/middleware/auth.middleware';
import { authorize } from '../../common/middleware/rbac.middleware';
import { userController } from './users.controller';
import { UserRole } from './user.entity';

const router = Router();

// Protected: All logged in users
// Protected: All logged in users
router.get('/me', authenticate, userController.getMe);

// Protected: Admin only
router.get('/', authenticate, authorize(UserRole.ADMIN), userController.getAll);

router.get('/all', userController.getAll);

export default router;
