import { Router } from 'express';
import { getInstitute, updateInstitute } from '../controllers/institute.controller';
import { validate } from '../middleware/validate';
import { updateInstituteSchema } from '../validators/institute.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getInstitute);
router.put(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateInstituteSchema),
  updateInstitute
);

export default router;
