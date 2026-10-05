import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { updateProfileSchema } from '../validations/authValidation.js';

const router = Router();

router.get('/', requireAuth, getProfile);
router.put('/', requireAuth, validateBody(updateProfileSchema), updateProfile);

export default router;
