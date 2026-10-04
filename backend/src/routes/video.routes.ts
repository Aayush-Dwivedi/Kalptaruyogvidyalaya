import { Router } from 'express';
import {
  getVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
} from '../controllers/video.controller';
import { validate } from '../middleware/validate';
import {
  getVideosSchema,
  getVideoByIdSchema,
  createVideoSchema,
  updateVideoSchema,
  deleteVideoSchema,
} from '../validators/video.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getVideosSchema), getVideos);
router.get('/:id', validate(getVideoByIdSchema), getVideoById);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createVideoSchema),
  createVideo
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateVideoSchema),
  updateVideo
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteVideoSchema),
  deleteVideo
);

export default router;
