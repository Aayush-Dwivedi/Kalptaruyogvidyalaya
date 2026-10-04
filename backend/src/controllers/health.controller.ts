import { Request, Response } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { getDBStatus } from '../config/database';
import { env } from '../config/env';

/**
 * Health check controller
 * Checks database connectivity, uptime, and system status
 */
export function getHealthStatus(_req: Request, res: Response): void {
  const dbStatus = getDBStatus();
  const uptime = process.uptime();

  const healthData = {
    status: dbStatus.isConnected ? 'healthy' : 'degraded',
    service: 'kalptaru-yog-vidyalaya-api',
    environment: env.NODE_ENV,
    uptimeSeconds: Math.floor(uptime),
    database: {
      status: dbStatus.stateText,
      connected: dbStatus.isConnected,
    },
    storageProvider: 'supabase',
    timestamp: new Date().toISOString(),
  };

  const httpStatus = dbStatus.isConnected ? 200 : 503;
  ApiResponse.success(res, healthData, 'API service health check', httpStatus);
}
