import { Request, Response } from 'express';
import { WorkshopService } from '../services/workshop.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getWorkshops = asyncHandler(async (req: Request, res: Response) => {
  const result = await WorkshopService.getWorkshops(req.query as any);
  return ApiResponse.success(res, result.items, 'Workshops retrieved successfully', 200, result.meta as any);
});

export const getWorkshopByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const workshop = await WorkshopService.getWorkshopByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, workshop, 'Workshop retrieved successfully');
});

export const createWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const workshop = await WorkshopService.createWorkshop(req.body);
  return ApiResponse.created(res, workshop, 'Workshop created successfully');
});

export const updateWorkshop = asyncHandler(async (req: Request, res: Response) => {
  const updated = await WorkshopService.updateWorkshop(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Workshop updated successfully');
});

export const deleteWorkshop = asyncHandler(async (req: Request, res: Response) => {
  await WorkshopService.deleteWorkshop(req.params.id);
  return ApiResponse.success(res, null, 'Workshop deleted successfully');
});
