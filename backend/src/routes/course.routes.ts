import { Router } from 'express';
import {
  getCourses,
  getCourseByIdOrSlug,
  createCourse,
  updateCourse,
  reorderCourses,
  deleteCourse,
} from '../controllers/course.controller';
import { validate } from '../middleware/validate';
import {
  getCoursesSchema,
  getCourseByIdOrSlugSchema,
  createCourseSchema,
  updateCourseSchema,
  reorderCoursesSchema,
  deleteCourseSchema,
} from '../validators/course.validator';

import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', validate(getCoursesSchema), getCourses);
router.get('/:idOrSlug', validate(getCourseByIdOrSlugSchema), getCourseByIdOrSlug);
router.post(
  '/',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(createCourseSchema),
  createCourse
);
router.patch(
  '/reorder',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(reorderCoursesSchema),
  reorderCourses
);
router.patch(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(updateCourseSchema),
  updateCourse
);
router.delete(
  '/:id',
  requireAuth,
  requireRole('admin', 'super_admin'),
  validate(deleteCourseSchema),
  deleteCourse
);

export default router;
