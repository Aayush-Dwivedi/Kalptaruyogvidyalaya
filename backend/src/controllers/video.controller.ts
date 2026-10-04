import { Request, Response } from 'express';
import { VideoService } from '../services/video.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getVideos = asyncHandler(async (req: Request, res: Response) => {
  const result = await VideoService.getVideos(req.query as any);
  return ApiResponse.success(res, result.items, 'Videos retrieved successfully', 200, result.meta as any);
});

export const getVideoById = asyncHandler(async (req: Request, res: Response) => {
  const video = await VideoService.getVideoById(req.params.id);
  return ApiResponse.success(res, video, 'Video retrieved successfully');
});

export const createVideo = asyncHandler(async (req: Request, res: Response) => {
  const video = await VideoService.createVideo(req.body);
  return ApiResponse.created(res, video, 'Video created successfully');
});

export const updateVideo = asyncHandler(async (req: Request, res: Response) => {
  const updated = await VideoService.updateVideo(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Video updated successfully');
});

export const deleteVideo = asyncHandler(async (req: Request, res: Response) => {
  await VideoService.deleteVideo(req.params.id);
  return ApiResponse.success(res, null, 'Video deleted successfully');
});
