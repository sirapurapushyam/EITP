import { Router } from 'express';
import * as auth from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import {
  registerStudentSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema
} from '../validators/auth.validators.js';

const router = Router();

router.post('/register', validate(registerStudentSchema), auth.register);
router.post('/login', validate(loginSchema), auth.signIn);
router.post('/logout', requireAuth, auth.signOut);
router.post('/refresh', auth.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), auth.forgot);
// router.post('/reset-password', validate(resetPasswordSchema), auth.reset);
router.post(
    "/reset-password/:token",
    validate(resetPasswordSchema),
    auth.reset
);
router.post('/change-password', requireAuth, validate(changePasswordSchema), auth.change);
router.get('/me', requireAuth, auth.me);
router.patch('/profile', requireAuth, auth.profile);

export default router;
