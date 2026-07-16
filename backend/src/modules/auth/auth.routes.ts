import { Router } from 'express';
import { validate } from '../../common/middleware/validate.middleware';
import { authController } from './auth.controller';
import { RegisterSchema, LoginSchema } from './auth.validators';

const router = Router();

router.post('/register', validate(RegisterSchema), authController.register);
router.post('/login', validate(LoginSchema), authController.login);

export default router;
