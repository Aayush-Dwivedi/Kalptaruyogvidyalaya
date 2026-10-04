import { Request, Response } from 'express';
import { CourseService } from '../services/course.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getCourses = asyncHandler(async (req: Request, res: Response) => {
  const result = await CourseService.getCourses(req.query as any);
  return ApiResponse.success(res, result.items, 'Courses retrieved successfully', 200, result.meta as any);
});

export const getCourseByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseService.getCourseByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, course, 'Course retrieved successfully');
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseService.createCourse(req.body);
  return ApiResponse.created(res, course, 'Course created successfully');
});

export const updateCourse = asyncHandler(async (req: Request, res: Response) => {
  const updated = await CourseService.updateCourse(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Course updated successfully');
});

export const reorderCourses = asyncHandler(async (req: Request, res: Response) => {
  await CourseService.reorderCourses(req.body);
  return ApiResponse.success(res, null, 'Courses reordered successfully');
});

export const deleteCourse = asyncHandler(async (req: Request, res: Response) => {
  await CourseService.deleteCourse(req.params.id);
  return ApiResponse.success(res, null, 'Course deleted successfully');
});
