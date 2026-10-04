import { Request, Response } from 'express';
import { CorporateService } from '../services/corporate.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCorporatePrograms = asyncHandler(async (req: Request, res: Response) => {
  const result = await CorporateService.getCorporatePrograms(req.query as any);
  return ApiResponse.success(res, result.items, 'Corporate programs retrieved successfully', 200, result.meta as any);
});

export const getCorporateProgramByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const program = await CorporateService.getCorporateProgramByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, program, 'Corporate program retrieved successfully');
});

export const createCorporateProgram = asyncHandler(async (req: Request, res: Response) => {
  const program = await CorporateService.createCorporateProgram(req.body);
  return ApiResponse.created(res, program, 'Corporate program created successfully');
});

export const updateCorporateProgram = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CorporateService.updateCorporateProgram(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Corporate program updated successfully');
});

export const deleteCorporateProgram = asyncHandler(async (req: Request, res: Response) => {
  await CorporateService.deleteCorporateProgram(req.params.id);
  return ApiResponse.success(res, null, 'Corporate program deleted successfully');
});
