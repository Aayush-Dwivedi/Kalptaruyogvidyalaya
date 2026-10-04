import { Router } from 'express';
import { getAdminDashboard } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

// Strict security: enforce authentication AND admin / super_admin role on all admin routes
router.use(requireAuth);
router.use(requireRole('admin', 'super_admin'));

// Admin Dashboard Overview: GET /api/admin/dashboard
router.get('/dashboard', getAdminDashboard);

export default router;
