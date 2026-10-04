import { Request, Response } from 'express';
import { BenefitService } from '../services/benefit.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getBenefits = asyncHandler(async (req: Request, res: Response) => {
  const result = await BenefitService.getBenefits(req.query as any);
  return ApiResponse.success(res, result.items, 'Benefits retrieved successfully', 200, result.meta as any);
});

export const getBenefitById = asyncHandler(async (req: Request, res: Response) => {
  const benefit = await BenefitService.getBenefitById(req.params.id);
  return ApiResponse.success(res, benefit, 'Benefit retrieved successfully');
});

export const createBenefit = asyncHandler(async (req: Request, res: Response) => {
  const benefit = await BenefitService.createBenefit(req.body);
  return ApiResponse.created(res, benefit, 'Benefit created successfully');
});

export const updateBenefit = asyncHandler(async (req: Request, res: Response) => {
  const updated = await BenefitService.updateBenefit(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Benefit updated successfully');
});

export const deleteBenefit = asyncHandler(async (req: Request, res: Response) => {
  await BenefitService.deleteBenefit(req.params.id);
  return ApiResponse.success(res, null, 'Benefit deleted successfully');
});
