import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Controller for Admin Portal Dashboard Overview
 * Strictly enforces admin authorization in routes
 */
export const getAdminDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const data = await AdminService.getDashboardOverview();
  return ApiResponse.success(res, data, 'Admin dashboard overview data retrieved successfully');
});
