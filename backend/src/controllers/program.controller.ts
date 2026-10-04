import { Request, Response } from 'express';
import { ProgramService } from '../services/program.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getPrograms = asyncHandler(async (req: Request, res: Response) => {
  const result = await ProgramService.getPrograms(req.query as any);
  return ApiResponse.success(res, result.items, 'Programs retrieved successfully', 200, result.meta as any);
});

export const getProgramByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const program = await ProgramService.getProgramByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, program, 'Program retrieved successfully');
});

export const createProgram = asyncHandler(async (req: Request, res: Response) => {
  const program = await ProgramService.createProgram(req.body);
  return ApiResponse.created(res, program, 'Program created successfully');
});

export const updateProgram = asyncHandler(async (req: Request, res: Response) => {
  const updated = await ProgramService.updateProgram(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Program updated successfully');
});

export const deleteProgram = asyncHandler(async (req: Request, res: Response) => {
  await ProgramService.deleteProgram(req.params.id);
  return ApiResponse.success(res, null, 'Program deleted successfully');
});
