import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/token';
import { User, IUser } from '../models/User';
import { AppError } from '../utils/appError';
import { UserRole } from '../types/user.types';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

/**
 * Authentication middleware requiring a valid JWT Bearer token
 */
export const requireAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication required. Please provide a valid Bearer token.');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Authentication token is missing.');
    }

    // Verify token signature and expiry
    const payload = verifyAccessToken(token);

    // Fetch user from DB
    const user = await User.findById(payload.id);
    if (!user) {
      throw AppError.unauthorized('The user belonging to this token no longer exists.');
    }

    if (!user.isActive) {
      throw AppError.forbidden('Your account has been deactivated. Please contact support.');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based authorization middleware supporting role hierarchy
 * super_admin > admin > student
 */
export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'));
    }

    const userRole = req.user.role;

    // Super admin has unrestricted access to all endpoints
    if (userRole === 'super_admin') {
      return next();
    }

    // Admin has access to admin and student level resources
    if (userRole === 'admin' && (allowedRoles.includes('admin') || allowedRoles.includes('student'))) {
      return next();
    }

    // Direct role match
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    return next(
      AppError.forbidden(
        `Forbidden: Role '${userRole}' is not authorized to access this resource. Required: [${allowedRoles.join(', ')}]`
      )
    );
  };
};
