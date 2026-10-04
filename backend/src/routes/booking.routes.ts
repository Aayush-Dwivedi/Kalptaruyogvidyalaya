import { Router } from 'express';
import {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
} from '../controllers/booking.controller';
import { validate } from '../middleware/validate';
import { requireAuth, requireRole } from '../middleware/auth';
import {
  createBookingSchema,
  getBookingsSchema,
  updateBookingStatusSchema,
  cancelBookingSchema,
} from '../validators/booking.validator';

const router = Router();

// All booking routes require authentication
router.use(requireAuth);

router.post('/', validate(createBookingSchema), createBooking);
router.get('/', validate(getBookingsSchema), getBookings);
router.get('/:id', getBookingById);
router.patch(
  '/:id/status',
  requireRole('admin', 'super_admin'),
  validate(updateBookingStatusSchema),
  updateBookingStatus
);
router.post('/:id/cancel', validate(cancelBookingSchema), cancelBooking);

export default router;
