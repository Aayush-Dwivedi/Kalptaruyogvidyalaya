import { Request, Response } from 'express';
import { InstituteService } from '../services/institute.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getInstitute = asyncHandler(async (_req: Request, res: Response) => {
  const institute = await InstituteService.getInstitute();
  return ApiResponse.success(res, institute, 'Institute details retrieved successfully');
});

export const updateInstitute = asyncHandler(async (req: Request, res: Response) => {
  const updated = await InstituteService.updateInstitute(req.body);
  return ApiResponse.success(res, updated, 'Institute details updated successfully');
});
