import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { loginSchema, signupSchema } from '../validators/schemas';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.post('/signup', validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.me));
router.post('/logout', authenticate, asyncHandler(authController.logout));

export default router;
