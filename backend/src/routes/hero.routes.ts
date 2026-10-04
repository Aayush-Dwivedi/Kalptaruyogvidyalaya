import { Router } from 'express';
import {
  getHeroSlides,
  getHeroSlideById,
  createHeroSlide,
  updateHeroSlide,
  reorderHeroSlides,
  deleteHeroSlide,
} from '../controllers/hero.controller';
import { validate } from '../middleware/validate';
import {
  getHeroSlidesSchema,
  getHeroSlideByIdSchema,
  createHeroSlideSchema,
  updateHeroSlideSchema,
  reorderHeroSlidesSchema,
  deleteHeroSlideSchema,
} from '../validators/hero.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getHeroSlidesSchema), getHeroSlides);
router.get('/:id', validate(getHeroSlideByIdSchema), getHeroSlideById);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createHeroSlideSchema),
  createHeroSlide
);
router.patch(
  '/reorder',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(reorderHeroSlidesSchema),
  reorderHeroSlides
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateHeroSlideSchema),
  updateHeroSlide
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteHeroSlideSchema),
  deleteHeroSlide
);

export default router;
