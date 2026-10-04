import { Request, Response } from 'express';
import { MembershipService } from '../services/membership.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const getMembershipPlans = asyncHandler(async (req: Request, res: Response) => {
  const result = await MembershipService.getMembershipPlans(req.query as any);
  return ApiResponse.success(res, result.items, 'Membership plans retrieved successfully', 200, result.meta as any);
});

export const getMembershipPlanByIdOrSlug = asyncHandler(async (req: Request, res: Response) => {
  const plan = await MembershipService.getMembershipPlanByIdOrSlug(req.params.idOrSlug);
  return ApiResponse.success(res, plan, 'Membership plan retrieved successfully');
});

export const createMembershipPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await MembershipService.createMembershipPlan(req.body);
  return ApiResponse.created(res, plan, 'Membership plan created successfully');
});

export const updateMembershipPlan = asyncHandler(async (req: Request, res: Response) => {
  const updated = await MembershipService.updateMembershipPlan(req.params.id, req.body);
  return ApiResponse.success(res, updated, 'Membership plan updated successfully');
});

export const deleteMembershipPlan = asyncHandler(async (req: Request, res: Response) => {
  await MembershipService.deleteMembershipPlan(req.params.id);
  return ApiResponse.success(res, null, 'Membership plan deleted successfully');
});
