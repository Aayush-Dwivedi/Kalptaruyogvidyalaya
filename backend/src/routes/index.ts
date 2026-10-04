import { Router } from 'express';
import healthRoutes from './health.routes';
import homeRoutes from './home.routes';
import instituteRoutes from './institute.routes';
import founderRoutes from './founder.routes';
import heroRoutes from './hero.routes';
import programRoutes from './program.routes';
import courseRoutes from './course.routes';
import workshopRoutes from './workshop.routes';
import corporateRoutes from './corporate.routes';
import membershipRoutes from './membership.routes';
import galleryRoutes from './gallery.routes';
import videoRoutes from './video.routes';
import benefitRoutes from './benefit.routes';
import mediaRoutes from './media.routes';
import authRoutes from './auth.routes';
import studentRoutes from './student.routes';
import adminRoutes from './admin.routes';
import bookingRoutes from './booking.routes';
import { ApiResponse } from '../utils/apiResponse';

const router = Router();

// API Root discovery endpoint: GET /api
router.get('/', (_req, res) => {
  ApiResponse.success(
    res,
    {
      name: 'Kalptaru Yog Vidyalaya CMS API',
      version: '1.0.0',
      status: 'operational',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        admin: '/api/admin',
        student: '/api/student',
        bookings: '/api/bookings',
        home: '/api/home',
        institute: '/api/institute',
        founders: '/api/founders',
        heroSlides: '/api/hero-slides',
        programs: '/api/programs',
        courses: '/api/courses',
        workshops: '/api/workshops',
        corporatePrograms: '/api/corporate-programs',
        membershipPlans: '/api/membership-plans',
        gallery: '/api/gallery',
        galleryCategories: '/api/gallery/categories',
        videos: '/api/videos',
        benefits: '/api/benefits',
        media: '/api/media',
      },
    },
    'Kalptaru Yog Vidyalaya CMS API Root'
  );
});

// Mounted resource routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/student', studentRoutes);
router.use('/bookings', bookingRoutes);
router.use('/home', homeRoutes);
router.use('/institute', instituteRoutes);
router.use('/founders', founderRoutes);
router.use('/hero-slides', heroRoutes);
router.use('/programs', programRoutes);
router.use('/courses', courseRoutes);
router.use('/workshops', workshopRoutes);
router.use('/corporate-programs', corporateRoutes);
router.use('/membership-plans', membershipRoutes);
router.use('/gallery', galleryRoutes);
router.use('/videos', videoRoutes);
router.use('/benefits', benefitRoutes);
router.use('/media', mediaRoutes);

export default router;
