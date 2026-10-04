import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const createBooking = asyncHandler(async (req: Request, res: Response) => {
  const studentId = req.user!._id.toString();
  const booking = await BookingService.createBooking(studentId, req.body);
  return ApiResponse.created(res, booking, 'Booking reservation created successfully.');
});

export const getBookings = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const isAdmin = ['admin', 'super_admin'].includes(user.role);
  const studentId = isAdmin ? undefined : user._id.toString();

  const result = await BookingService.getBookings(req.query as any, studentId);
  return ApiResponse.success(res, result.items, 'Bookings retrieved successfully.', 200, result.meta as any);
});

export const getBookingById = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const booking = await BookingService.getBookingById(req.params.id, {
    _id: user._id.toString(),
    role: user.role,
  });
  return ApiResponse.success(res, booking, 'Booking details retrieved successfully.');
});

export const updateBookingStatus = asyncHandler(async (req: Request, res: Response) => {
  const updated = await BookingService.updateBookingStatus(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Booking status updated successfully.');
});

export const cancelBooking = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user!;
  const cancelled = await BookingService.cancelBooking(
    req.params.id,
    { _id: user._id.toString(), role: user.role },
    req.body.reason
  );
  return ApiResponse.success(res, cancelled, 'Booking cancelled successfully.');
});
