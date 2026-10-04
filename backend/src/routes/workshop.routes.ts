import { Router } from 'express';
import {
  getWorkshops,
  getWorkshopByIdOrSlug,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} from '../controllers/workshop.controller';
import { validate } from '../middleware/validate';
import {
  getWorkshopsSchema,
  getWorkshopByIdOrSlugSchema,
  createWorkshopSchema,
  updateWorkshopSchema,
  deleteWorkshopSchema,
} from '../validators/workshop.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getWorkshopsSchema), getWorkshops);
router.get('/:idOrSlug', validate(getWorkshopByIdOrSlugSchema), getWorkshopByIdOrSlug);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createWorkshopSchema),
  createWorkshop
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateWorkshopSchema),
  updateWorkshop
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteWorkshopSchema),
  deleteWorkshop
);

export default router;
