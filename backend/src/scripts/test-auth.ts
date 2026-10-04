import http from 'http';
import express from 'express';
import bcrypt from 'bcryptjs';
import { createApp } from '../app';
import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

async function runAuthTests() {
  logger.info('==================================================');
  logger.info('  PHASE 7: Authentication & Authorization Tests  ');
  logger.info('==================================================');

  await connectDB();
  const app = createApp();

  // Create a separate test server for role-based route tests with requireAuth & requireRole
  const testRoleApp = express();
  testRoleApp.use(express.json());

  testRoleApp.get('/test/protected', requireAuth, (req, res) => {
    ApiResponse.success(res, { userId: req.user?._id, role: req.user?.role }, 'Protected data accessed');
  });

  testRoleApp.get('/test/admin-only', requireAuth, requireRole('admin'), (req, res) => {
    ApiResponse.success(res, { role: req.user?.role }, 'Admin resource accessed');
  });

  testRoleApp.get('/test/super-admin-only', requireAuth, requireRole('super_admin'), (req, res) => {
    ApiResponse.success(res, { role: req.user?.role }, 'Super admin resource accessed');
  });

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = `http://localhost:${port}/api/auth`;

  const roleServer = http.createServer(testRoleApp);
  await new Promise<void>((resolve) => roleServer.listen(0, resolve));
  const rolePort = (roleServer.address() as any).port;
  const roleBaseUrl = `http://localhost:${rolePort}`;

  let passed = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      logger.info(`[PASS] ${testName}${detail ? ` (${detail})` : ''}`);
      passed++;
    } else {
      logger.error(`[FAIL] ${testName}${detail ? `: ${detail}` : ''}`);
    }
  }

  const testEmail = `student_${Date.now()}@kalptaru-test.org`;
  const testPassword = 'SecurePassword123!';

  // Clean up any previous test user
  await User.deleteMany({ email: { $regex: /kalptaru-test\.org$/ } });

  // 1. Test Student Registration Validation: Passwords mismatch
  const mismatchRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Patel',
      email: testEmail,
      phone: '+91 98765 11111',
      password: testPassword,
      confirmPassword: 'DifferentPassword123!',
    }),
  });
  const mismatchData = await mismatchRes.json();
  assert(
    mismatchRes.status === 400 && !mismatchData.success,
    'Registration rejects password mismatch (400 Bad Request)'
  );

  // 2. Test Student Registration: Success
  const regRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Patel',
      email: testEmail,
      phone: '+91 98765 11111',
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  const regData = await regRes.json();
  assert(
    regRes.status === 201 &&
      regData.success &&
      !!regData.data?.tokens?.accessToken &&
      !!regData.data?.tokens?.refreshToken,
    'Student registration succeeds with JWT access & refresh tokens'
  );

  // 3. Test Plain Text Password Security: Password MUST NOT be plain text in MongoDB
  const savedUser = await User.findOne({ email: testEmail }).select('+password');
  assert(
    !!savedUser?.password &&
      savedUser.password !== testPassword &&
      savedUser.password.startsWith('$2'),
    'Password is never stored in plain text and is securely hashed with bcrypt'
  );

  // Password comparison verification
  const bcryptMatch = await bcrypt.compare(testPassword, savedUser!.password!);
  assert(bcryptMatch, 'Bcrypt hash correctly verifies raw password');

  // Password is NOT exposed in response payload
  assert(
    !regData.data.user.password,
    'Password hash is excluded from API JSON responses'
  );

  // 4. Test Duplicate Email Prevention
  const dupRes = await fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Duplicate',
      email: testEmail,
      phone: '+91 98765 22222',
      password: testPassword,
      confirmPassword: testPassword,
    }),
  });
  assert(dupRes.status === 409, 'Registration rejects duplicate email with 409 Conflict');

  // 5. Test Student Login: Invalid credentials
  const badLoginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: 'WrongPassword123!',
    }),
  });
  const badLoginData = await badLoginRes.json();
  assert(
    badLoginRes.status === 401 && badLoginData.message === 'Invalid email or password.',
    'Login rejects invalid password with secure generic message to prevent enumeration'
  );

  // 6. Test Student Login: Valid credentials
  const loginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });
  const loginData = await loginRes.json();
  const studentToken = loginData.data?.tokens?.accessToken;
  const studentRefreshToken = loginData.data?.tokens?.refreshToken;
  assert(
    loginRes.status === 200 && !!studentToken && !!studentRefreshToken,
    'Student login succeeds and issues active session tokens'
  );

  // 7. Test Protected Route: requireAuth without token
  const unauthRes = await fetch(`${baseUrl}/me`);
  assert(unauthRes.status === 401, 'Protected route /me rejects unauthenticated request (401)');

  // 8. Test Protected Route: requireAuth with valid token
  const meRes = await fetch(`${baseUrl}/me`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const meData = await meRes.json();
  assert(
    meRes.status === 200 && meData.data?.email === testEmail && meData.data?.role === 'student',
    'Protected route /me returns authenticated user profile'
  );

  // 9. Test Authorization: requireRole ('admin') blocks 'student'
  const adminForbiddenRes = await fetch(`${roleBaseUrl}/test/admin-only`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  assert(
    adminForbiddenRes.status === 403,
    'requireRole blocks Student from accessing Admin-only endpoint (403 Forbidden)'
  );

  // 10. Test Admin Access & Role Hierarchy
  const adminUser = await User.create({
    name: 'Master Acharya Admin',
    email: `admin_${Date.now()}@kalptaru-test.org`,
    phone: '+91 98765 33333',
    password: testPassword,
    role: 'admin',
    isActive: true,
  });

  const adminLoginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: adminUser.email,
      password: testPassword,
    }),
  });
  const adminLoginData = await adminLoginRes.json();
  const adminToken = adminLoginData.data.tokens.accessToken;

  const adminAccessRes = await fetch(`${roleBaseUrl}/test/admin-only`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  assert(
    adminAccessRes.status === 200,
    'Admin successfully accesses Admin-only protected route (200 OK)'
  );

  // 11. Test Super Admin Access to Admin and Super Admin routes
  const superAdminUser = await User.create({
    name: 'Grandmaster Super Admin',
    email: `superadmin_${Date.now()}@kalptaru-test.org`,
    phone: '+91 98765 44444',
    password: testPassword,
    role: 'super_admin',
    isActive: true,
  });

  const superAdminLoginRes = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: superAdminUser.email,
      password: testPassword,
    }),
  });
  const superAdminLoginData = await superAdminLoginRes.json();
  const superAdminToken = superAdminLoginData.data.tokens.accessToken;

  const superAdminAccessRes = await fetch(`${roleBaseUrl}/test/super-admin-only`, {
    headers: { Authorization: `Bearer ${superAdminToken}` },
  });
  assert(
    superAdminAccessRes.status === 200,
    'Super Admin successfully accesses Super-Admin protected route'
  );

  const superAdminAdminAccessRes = await fetch(`${roleBaseUrl}/test/admin-only`, {
    headers: { Authorization: `Bearer ${superAdminToken}` },
  });
  assert(
    superAdminAdminAccessRes.status === 200,
    'Role hierarchy allows Super Admin to access Admin routes'
  );

  // 12. Test Refresh Token Strategy & Token Rotation
  const refreshRes = await fetch(`${baseUrl}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: studentRefreshToken }),
  });
  const refreshData = await refreshRes.json();
  assert(
    refreshRes.status === 200 &&
      refreshData.success &&
      !!refreshData.data?.accessToken &&
      !!refreshData.data?.refreshToken,
    'Refresh token successfully rotates and issues new access & refresh tokens'
  );

  const oldTokenReuse = await fetch(`${baseUrl}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: studentRefreshToken }),
  });
  assert(
    oldTokenReuse.status === 401,
    'Reusing an already rotated refresh token is rejected (401 Unauthorized)'
  );

  // 13. Test Logout: Invalidates refresh token
  const newRefreshToken = refreshData.data.refreshToken;
  const newAccessToken = refreshData.data.accessToken;

  const logoutRes = await fetch(`${baseUrl}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${newAccessToken}`,
    },
    body: JSON.stringify({ refreshToken: newRefreshToken }),
  });
  assert(logoutRes.status === 200, 'Logout succeeds and invalidates the session token');

  // Attempt to refresh after logout
  const postLogoutRefresh = await fetch(`${baseUrl}/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: newRefreshToken }),
  });
  assert(
    postLogoutRefresh.status === 401,
    'Logged-out refresh token is revoked and cannot be refreshed (401)'
  );

  // Cleanup test users
  await User.deleteMany({ email: { $regex: /kalptaru-test\.org$/ } });

  server.close();
  roleServer.close();
  await disconnectDB();

  logger.info('==================================================');
  logger.info(`Auth Test Suite Completed: ${passed} / ${totalTests} passed`);
  logger.info('==================================================');

  if (passed === totalTests) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runAuthTests().catch((err) => {
  logger.error('Fatal auth test error:', err);
  process.exit(1);
});
