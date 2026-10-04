import { Router } from 'express';
import { getStudentDashboard } from '../controllers/student.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Student Dashboard Overview: GET /api/student/dashboard
router.get('/dashboard', requireAuth, getStudentDashboard);

export default router;
