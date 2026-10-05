import { Router } from 'express';
import { register, login, logout, me } from '../controllers/authController.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { registerSchema, loginSchema } from '../validations/authValidation.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
