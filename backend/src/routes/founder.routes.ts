import { Router } from 'express';
import {
  getFounders,
  getFounderByIdOrSlug,
  createFounder,
  updateFounder,
  deleteFounder,
} from '../controllers/founder.controller';
import { validate } from '../middleware/validate';
import {
  getFoundersSchema,
  getFounderByIdOrSlugSchema,
  createFounderSchema,
  updateFounderSchema,
  deleteFounderSchema,
} from '../validators/founder.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getFoundersSchema), getFounders);
router.get('/:idOrSlug', validate(getFounderByIdOrSlugSchema), getFounderByIdOrSlug);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createFounderSchema),
  createFounder
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateFounderSchema),
  updateFounder
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteFounderSchema),
  deleteFounder
);

export default router;
