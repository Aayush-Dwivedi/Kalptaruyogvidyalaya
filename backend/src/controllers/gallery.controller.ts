import { Request, Response } from 'express';
import { GalleryService } from '../services/gallery.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

// --- Category Handlers ---
export const getGalleryCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await GalleryService.getCategories();
  return ApiResponse.success(res, categories, 'Gallery categories retrieved successfully');
});

export const getGalleryCategoryByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const category = await GalleryService.getCategoryByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, category, 'Gallery category retrieved successfully');
});

export const createGalleryCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await GalleryService.createCategory(req.body);
  return ApiResponse.created(res, category, 'Gallery category created successfully');
});

export const updateGalleryCategory = asyncHandler(async (req: Request, res: Response) => {
  const updated = await GalleryService.updateCategory(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Gallery category updated successfully');
});

export const deleteGalleryCategory = asyncHandler(async (req: Request, res: Response) => {
  await GalleryService.deleteCategory(req.params.id);
  return ApiResponse.success(res, null, 'Gallery category deleted successfully');
});

// --- Image Handlers ---
export const getGalleryImages = asyncHandler(async (req: Request, res: Response) => {
  const result = await GalleryService.getGalleryImages(req.query as any);
  return ApiResponse.success(res, result.items, 'Gallery images retrieved successfully', 200, result.meta as any);
});

export const getGalleryImageById = asyncHandler(async (req: Request, res: Response) => {
  const image = await GalleryService.getGalleryImageById(req.params.id);
  return ApiResponse.success(res, image, 'Gallery image retrieved successfully');
});

export const createGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const image = await GalleryService.createGalleryImage(req.body);
  return ApiResponse.created(res, image, 'Gallery image created successfully');
});

export const updateGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  const updated = await GalleryService.updateGalleryImage(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Gallery image updated successfully');
});

export const deleteGalleryImage = asyncHandler(async (req: Request, res: Response) => {
  await GalleryService.deleteGalleryImage(req.params.id);
  return ApiResponse.success(res, null, 'Gallery image deleted successfully');
});
