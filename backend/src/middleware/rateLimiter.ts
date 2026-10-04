import rateLimit from 'express-rate-limit';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Strict rate limiter for authentication endpoints to mitigate brute-force and credential stuffing
 * Allows 15 requests per 15-minute window per IP
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many authentication attempts from this IP address. Please try again after 15 minutes.',
      429
    );
  },
});

/**
 * General API rate limiter
 */
export const generalApiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    ApiResponse.error(
      res,
      'Too many requests from this IP address. Please slow down.',
      429
    );
  },
});
