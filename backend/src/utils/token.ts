import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { IUser } from '../models/User';
import { AuthTokens, TokenPayload, RefreshTokenPayload } from '../types/user.types';
import { AppError } from './appError';

/**
 * Generates short-lived Access Token
 */
export function generateAccessToken(user: IUser): string {
  const payload: TokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
}

/**
 * Generates long-lived Refresh Token
 */
export function generateRefreshToken(user: IUser): { token: string; expiresAt: Date } {
  const payload: RefreshTokenPayload = {
    id: user._id.toString(),
  };

  const token = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });

  // Calculate expiration date (default 30 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return { token, expiresAt };
}

/**
 * Generates both Access and Refresh tokens
 */
export function generateAuthTokens(user: IUser): AuthTokens {
  const accessToken = generateAccessToken(user);
  const { token: refreshToken } = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
    tokenType: 'Bearer',
    expiresIn: env.JWT_EXPIRES_IN,
  };
}

/**
 * Verifies and decodes an Access Token
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Access token has expired. Please refresh your session.');
    }
    throw AppError.unauthorized('Invalid authentication token.');
  }
}

/**
 * Verifies and decodes a Refresh Token
 */
export function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw AppError.unauthorized('Refresh token has expired. Please log in again.');
    }
    throw AppError.unauthorized('Invalid refresh token.');
  }
}
