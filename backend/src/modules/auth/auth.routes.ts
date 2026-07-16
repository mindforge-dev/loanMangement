import { Router } from 'express';
import { validate } from '../../common/middleware/validate.middleware';
import { authController } from './auth.controller';
import { RegisterSchema, LoginSchema, RefreshSchema } from './auth.validators';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);
router.post('/refresh', validate(RefreshSchema), authController.refresh);
router.post('/logout', validate(RefreshSchema), authController.logout);

export default router;
