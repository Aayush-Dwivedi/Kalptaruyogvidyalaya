import { Response } from 'express';

export interface StandardApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
  meta?: Record<string, unknown>;
  timestamp: string;
}

export class ApiResponse {
  static success<T>(
    res: Response,
    data: T,
    message = 'Operation successful',
    statusCode = 200,
    meta?: Record<string, unknown>
  ): Response {
    const payload: StandardApiResponse<T> = {
      success: true,
      message,
      data,
      ...(meta ? { meta } : {}),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message = 'Resource created successfully'): Response {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(
    res: Response,
    message = 'An unexpected error occurred',
    statusCode = 500,
    errors?: unknown
  ): Response {
    const payload: StandardApiResponse<null> = {
      success: false,
      message,
      ...(errors ? { errors } : {}),
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }
}
