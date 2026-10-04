import { Router } from 'express';
import {
  getBenefits,
  getBenefitById,
  createBenefit,
  updateBenefit,
  deleteBenefit,
} from '../controllers/benefit.controller';
import { validate } from '../middleware/validate';
import {
  getBenefitsSchema,
  getBenefitByIdSchema,
  createBenefitSchema,
  updateBenefitSchema,
  deleteBenefitSchema,
} from '../validators/benefit.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getBenefitsSchema), getBenefits);
router.get('/:id', validate(getBenefitByIdSchema), getBenefitById);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createBenefitSchema),
  createBenefit
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateBenefitSchema),
  updateBenefit
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteBenefitSchema),
  deleteBenefit
);

export default router;
