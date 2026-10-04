import { Request, Response } from 'express';
import { HeroService } from '../services/hero.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getHeroSlides = asyncHandler(async (req: Request, res: Response) => {
  const activeOnly = req.query.activeOnly !== 'false';
  const slides = await HeroService.getHeroSlides(activeOnly);
  return ApiResponse.success(res, slides, 'Hero slides retrieved successfully');
});

export const getHeroSlideById = asyncHandler(async (req: Request, res: Response) => {
  const slide = await HeroService.getHeroSlideById(req.params.id);
  return ApiResponse.success(res, slide, 'Hero slide retrieved successfully');
});

export const createHeroSlide = asyncHandler(async (req: Request, res: Response) => {
  const slide = await HeroService.createHeroSlide(req.body);
  return ApiResponse.created(res, slide, 'Hero slide created successfully');
});

export const updateHeroSlide = asyncHandler(async (req: Request, res: Response) => {
  const updated = await HeroService.updateHeroSlide(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Hero slide updated successfully');
});

export const reorderHeroSlides = asyncHandler(async (req: Request, res: Response) => {
  await HeroService.reorderHeroSlides(req.body.slides);
  return ApiResponse.success(res, null, 'Hero slides reordered successfully');
});

export const deleteHeroSlide = asyncHandler(async (req: Request, res: Response) => {
  await HeroService.deleteHeroSlide(req.params.id);
  return ApiResponse.success(res, null, 'Hero slide deleted successfully');
});
