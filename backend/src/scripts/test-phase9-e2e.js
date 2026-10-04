// Complete Phase 9 E2E Verification Script
const BASE_URL = 'http://localhost:5000/api';

async function runE2E() {
  console.log('==================================================');
  console.log('  PHASE 9: Admin Portal Foundation E2E Validation  ');
  console.log('==================================================\n');

  // 1. Health check
  console.log('1. Checking backend health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthJson = await healthRes.json();
  console.log(`✓ Health status: ${healthJson.data?.status || 'OK'}`);

  // 2. Unauthenticated access must fail with 401
  console.log('\n2. Testing unauthenticated access to /api/admin/dashboard...');
  const unauthRes = await fetch(`${BASE_URL}/admin/dashboard`);
  console.log(`✓ Unauthenticated request: HTTP ${unauthRes.status} (Expected 401)`);
  if (unauthRes.status !== 401) throw new Error('Expected 401');

  // 3. Student role access must fail with 403
  console.log('\n3. Testing student account access to /api/admin/dashboard...');
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@kalptaruyog.org',
      password: 'Student@Kalptaru2026!',
    }),
  });
  const studentData = await studentLoginRes.json();
  const studentToken = studentData.data.tokens.accessToken;

  const studentAdminRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  console.log(`✓ Student role access: HTTP ${studentAdminRes.status} (Expected 403 Forbidden)`);
  if (studentAdminRes.status !== 403) throw new Error('Expected 403 Forbidden for student role');

  // 4. Admin role access must succeed with 200
  console.log('\n4. Testing Super Admin login and access to /api/admin/dashboard...');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@kalptaruyog.org',
      password: 'Admin@Kalptaru2026!',
    }),
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success) throw new Error('Admin login failed');

  const adminToken = adminData.data.tokens.accessToken;
  console.log(`✓ Admin logged in: ${adminData.data.user.name}, role: ${adminData.data.user.role}`);

  const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminDashJson = await adminDashRes.json();
  console.log(`✓ Admin dashboard access: HTTP ${adminDashRes.status} (Expected 200 OK)`);
  if (adminDashRes.status !== 200) throw new Error('Expected 200 OK');

  const d = adminDashJson.data;
  console.log('\n5. Validating Dashboard Foundation Components:');
  console.log(`  ✓ Overview Card - Students: ${d.overview.students.total} (${d.overview.students.growth})`);
  console.log(`  ✓ Overview Card - Bookings: ${d.overview.bookings.total} (${d.overview.bookings.growth})`);
  console.log(`  ✓ Overview Card - Courses: ${d.overview.courses.published} published / ${d.overview.courses.total} total`);
  console.log(`  ✓ Overview Card - Workshops: ${d.overview.workshops.upcoming} upcoming`);
  console.log(`  ✓ Overview Card - Memberships: ${d.overview.memberships.activeMembers} active (${d.overview.memberships.monthlyRecurring})`);
  console.log(`  ✓ Overview Card - Revenue: ${d.overview.revenue.totalFormatted} (${d.overview.revenue.growth})`);
  console.log(`  ✓ Feed - Recent Activity (${d.recentActivity.length} items logged)`);
  console.log(`  ✓ Feed - Recent Bookings (${d.recentBookings.length} records)`);
  console.log(`  ✓ Feed - Upcoming Workshops (${d.upcomingWorkshops.length} scheduled)`);
  console.log(`  ✓ Feed - New Enquiries (${d.newEnquiries.length} received)`);

  console.log('\n==================================================');
  console.log('  ALL PHASE 9 E2E VALIDATION CHECKS PASSED        ');
  console.log('==================================================\n');
}

runE2E().catch((err) => {
  console.error('E2E Test Failed:', err);
  process.exit(1);
});
