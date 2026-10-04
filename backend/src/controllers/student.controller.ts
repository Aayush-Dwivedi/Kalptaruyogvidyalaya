import { Request, Response } from 'express';
import { StudentService } from '../services/student.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getStudentDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const data = await StudentService.getStudentDashboard(userId);
  return ApiResponse.success(res, data, 'Student dashboard data retrieved successfully');
});
