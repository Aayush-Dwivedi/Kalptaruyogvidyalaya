import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  logoutAll,
  getMe,
  updateProfile,
} from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { requireAuth } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';
import {
  registerStudentSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from '../validators/auth.validator';

const router = Router();

// Student Registration: POST /api/auth/register
router.post('/register', authRateLimiter, validate(registerStudentSchema), register);

// User / Student / Admin Login: POST /api/auth/login
router.post('/login', authRateLimiter, validate(loginSchema), login);

// Refresh Access Token: POST /api/auth/refresh-token
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);

// Current User Profile: GET /api/auth/me
router.get('/me', requireAuth, getMe);

// Update Profile: PATCH /api/auth/profile
router.patch('/profile', requireAuth, validate(updateProfileSchema), updateProfile);

// Logout (invalidate current refresh token): POST /api/auth/logout
router.post('/logout', requireAuth, logout);

// Logout all devices: POST /api/auth/logout-all
router.post('/logout-all', requireAuth, logoutAll);

export default router;
