import { Router } from 'express';
import {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  toggleFavorite,
  deleteAdvisory,
  getDashboardStats,
} from '../controllers/advisoryController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import { advisoryRequestSchema } from '../validations/advisoryValidation.js';

const router = Router();

router.post('/', requireAuth, validateBody(advisoryRequestSchema), createAdvisory);
router.get('/', requireAuth, getAdvisories);
router.get('/dashboard-stats', requireAuth, getDashboardStats);
router.get('/:id', requireAuth, getAdvisoryById);
router.patch('/:id/favorite', requireAuth, toggleFavorite);
router.delete('/:id', requireAuth, deleteAdvisory);

export default router;
