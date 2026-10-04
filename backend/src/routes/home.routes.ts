import { Router } from 'express';
import { getHomeContent, updateHomepageCta } from '../controllers/home.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getHomeContent);
router.put('/cta', requireAuth, requireRole('admin', 'super_admin'), updateHomepageCta);

export default router;
