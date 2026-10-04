import { Request, Response } from 'express';
import { FounderService } from '../services/founder.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getFounders = asyncHandler(async (req: Request, res: Response) => {
  const result = await FounderService.getFounders(req.query as any);
  return ApiResponse.success(res, result.items, 'Founders retrieved successfully', 200, result.meta as any);
});

export const getFounderByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const founder = await FounderService.getFounderByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, founder, 'Founder retrieved successfully');
});

export const createFounder = asyncHandler(async (req: Request, res: Response) => {
  const founder = await FounderService.createFounder(req.body);
  return ApiResponse.created(res, founder, 'Founder created successfully');
});

export const updateFounder = asyncHandler(async (req: Request, res: Response) => {
  const updated = await FounderService.updateFounder(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Founder updated successfully');
});

export const deleteFounder = asyncHandler(async (req: Request, res: Response) => {
  await FounderService.deleteFounder(req.params.id);
  return ApiResponse.success(res, null, 'Founder deleted successfully');
});
