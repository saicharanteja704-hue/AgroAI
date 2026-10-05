import { Router } from 'express';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farmController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { farmSchema } from '../validations/farmValidation.js';

const router = Router();

router.get('/', requireAuth, getFarms);
router.get('/:id', requireAuth, getFarmById);
router.post('/', requireAuth, validateBody(farmSchema), createFarm);
router.put('/:id', requireAuth, validateBody(farmSchema), updateFarm);
router.delete('/:id', requireAuth, deleteFarm);

export default router;
