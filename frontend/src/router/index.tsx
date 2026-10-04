import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { StudentLayout } from '../layouts/StudentLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import {
  HomePage,
  AboutPage,
  FounderPage,
  InstitutePage,
  ProgramsPage,
  CoursesPage,
  WorkshopsPage,
  CorporatePage,
  MembershipPage,
  VideosPage,
  GalleryPage,
  EventsPage,
  ContactPage,
  EnquiryPage,
  LoginPage,
  RegisterPage,
  NotFoundPage,
  DashboardOverview,
  ProfilePage,
  CoursesView,
  PurchasesView,
  BookingsView,
  WorkshopsView,
  MembershipView,
  PaymentsView,
  SettingsView,
  AdminDashboardPage,
  AdminContentHomepage,
  AdminContentInstitute,
  AdminContentFounder,
  AdminContentBenefits,
  AdminProgramsCourses,
  AdminProgramsWorkshops,
  AdminProgramsCorporate,
  AdminProgramsMembership,
  AdminMediaGallery,
  AdminMediaVideos,
  AdminUsersPage,
  AdminBookingsPage,
  AdminOrdersPage,
  AdminEnquiriesPage,
  AdminSettingsPage,
} from '../pages';
import { DesignSystemShowcase } from '../components/DesignSystemShowcase';

export const router = createBrowserRouter([
  // Public Website Routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'about/founder', element: <FounderPage /> },
      { path: 'about/institute', element: <InstitutePage /> },
      { path: 'programs', element: <ProgramsPage /> },
      { path: 'programs/trainers', element: <ProgramsPage /> },
      { path: 'programs/courses', element: <CoursesPage /> },
      { path: 'programs/workshops', element: <WorkshopsPage /> },
      { path: 'programs/corporate', element: <CorporatePage /> },
      { path: 'programs/membership', element: <MembershipPage /> },
      { path: 'videos', element: <VideosPage /> },
      { path: 'gallery', element: <GalleryPage /> },
      { path: 'gallery/events', element: <EventsPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'contact/enquiry', element: <EnquiryPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'design-system', element: <DesignSystemShowcase /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },

  // Student Portal Protected Routes (/dashboard)
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardOverview /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'courses', element: <CoursesView /> },
      { path: 'purchases', element: <PurchasesView /> },
      { path: 'bookings', element: <BookingsView /> },
      { path: 'workshops', element: <WorkshopsView /> },
      { path: 'membership', element: <MembershipView /> },
      { path: 'payments', element: <PaymentsView /> },
      { path: 'settings', element: <SettingsView /> },
    ],
  },

  // Admin Portal Protected Routes (/admin) — Strictly requires admin or super_admin
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      // Content
      { path: 'content/homepage', element: <AdminContentHomepage /> },
      { path: 'content/institute', element: <AdminContentInstitute /> },
      { path: 'content/founder', element: <AdminContentFounder /> },
      { path: 'content/benefits', element: <AdminContentBenefits /> },
      // Programs
      { path: 'programs/courses', element: <AdminProgramsCourses /> },
      { path: 'programs/workshops', element: <AdminProgramsWorkshops /> },
      { path: 'programs/corporate', element: <AdminProgramsCorporate /> },
      { path: 'programs/membership', element: <AdminProgramsMembership /> },
      // Media
      { path: 'media/gallery', element: <AdminMediaGallery /> },
      { path: 'media/videos', element: <AdminMediaVideos /> },
      // Core Admin Modules
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'bookings', element: <AdminBookingsPage /> },
      { path: 'orders', element: <AdminOrdersPage /> },
      { path: 'enquiries', element: <AdminEnquiriesPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },
]);
