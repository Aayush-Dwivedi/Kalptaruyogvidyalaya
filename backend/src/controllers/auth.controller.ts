import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const { user, tokens } = await AuthService.registerStudent(
    req.body,
    userAgent,
    ipAddress
  );

  return ApiResponse.created(
    res,
    { user, tokens },
    'Registration successful. Welcome to Kalptaru Yog Vidyalaya!'
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const { user, tokens } = await AuthService.login(
    req.body.email,
    req.body.password,
    userAgent,
    ipAddress
  );

  return ApiResponse.success(
    res,
    { user, tokens },
    'Authentication successful. Session started.'
  );
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const userAgent = req.headers['user-agent'];
  const ipAddress = req.ip;

  const tokens = await AuthService.refreshTokens(
    req.body.refreshToken,
    userAgent,
    ipAddress
  );

  return ApiResponse.success(res, tokens, 'Tokens refreshed successfully.');
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const incomingToken = req.body.refreshToken;

  await AuthService.logout(userId, incomingToken);

  return ApiResponse.success(res, null, 'Logged out successfully.');
});

export const logoutAll = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();

  await AuthService.logoutAll(userId);

  return ApiResponse.success(res, null, 'Logged out from all sessions successfully.');
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.getCurrentUser(req.user!._id.toString());
  return ApiResponse.success(res, user, 'User profile retrieved successfully.');
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!._id.toString();
  const updatedUser = await AuthService.updateProfile(userId, req.body);
  return ApiResponse.success(res, updatedUser, 'Profile updated successfully.');
});
