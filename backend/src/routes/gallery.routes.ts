import { Router } from 'express';
import {
  getGalleryCategories,
  getGalleryCategoryByIdOrSlug,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
  getGalleryImages,
  getGalleryImageById,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/gallery.controller';
import { validate } from '../middleware/validate';
import {
  createGalleryCategorySchema,
  updateGalleryCategorySchema,
  deleteGalleryCategorySchema,
  getGalleryImagesSchema,
  getGalleryImageByIdSchema,
  createGalleryImageSchema,
  updateGalleryImageSchema,
  deleteGalleryImageSchema,
} from '../validators/gallery.validator';
import { idOrSlugParamSchema } from '../validators/common.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// --- Categories ---
router.get('/categories', getGalleryCategories);
router.get('/categories/:idOrSlug', validate({ params: idOrSlugParamSchema }), getGalleryCategoryByIdOrSlug);
router.post(
  '/categories',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createGalleryCategorySchema),
  createGalleryCategory
);
router.patch(
  '/categories/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateGalleryCategorySchema),
  updateGalleryCategory
);
router.delete(
  '/categories/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteGalleryCategorySchema),
  deleteGalleryCategory
);

// --- Gallery Images ---
router.get('/', validate(getGalleryImagesSchema), getGalleryImages);
router.get('/:id', validate(getGalleryImageByIdSchema), getGalleryImageById);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createGalleryImageSchema),
  createGalleryImage
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateGalleryImageSchema),
  updateGalleryImage
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteGalleryImageSchema),
  deleteGalleryImage
);

export default router;
