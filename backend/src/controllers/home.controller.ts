import { Request, Response } from 'express';
import { HomeService } from '../services/home.service';
import { InstituteService } from '../services/institute.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getHomeContent = asyncHandler(async (_req: Request, res: Response) => {
  const content = await HomeService.getHomeContent();
  return ApiResponse.success(res, content, 'Home content aggregated successfully');
});

export const updateHomepageCta = asyncHandler(async (req: Request, res: Response) => {
  const updated = await InstituteService.updateInstitute({
    homepageCta: req.body,
  });
  return ApiResponse.success(res, updated.homepageCta, 'Homepage CTA updated successfully');
});
