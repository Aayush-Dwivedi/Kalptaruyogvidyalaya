// Test admin authorization and dashboard endpoint
const BASE_URL = 'http://localhost:5000/api';

async function testAdminBackend() {
  console.log('--- Testing Phase 9 Admin Security & Authorization ---');

  // 1. Unauthenticated access test
  console.log('\n1. Testing Unauthenticated Access to /api/admin/dashboard...');
  const unauthRes = await fetch(`${BASE_URL}/admin/dashboard`);
  console.log(`✓ Status code: ${unauthRes.status} (Expected: 401)`);
  if (unauthRes.status !== 401) {
    throw new Error('Unauthenticated access should be rejected with 401');
  }

  // 2. Student access test (Should be forbidden with 403)
  console.log('\n2. Testing Student Role Access to /api/admin/dashboard (Must be 403 Forbidden)...');
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
  console.log(`✓ Student access status code: ${studentAdminRes.status} (Expected: 403)`);
  if (studentAdminRes.status !== 403) {
    throw new Error('Student access to admin portal must be rejected with 403');
  }

  // 3. Admin access test (Should succeed with 200)
  console.log('\n3. Testing Super Admin Access to /api/admin/dashboard...');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@kalptaruyog.org',
      password: 'Admin@Kalptaru2026!',
    }),
  });
  const adminData = await adminLoginRes.json();
  if (!adminData.success) {
    throw new Error(`Admin login failed: ${adminData.message}`);
  }
  const adminToken = adminData.data.tokens.accessToken;
  console.log(`✓ Logged in as: ${adminData.data.user.name}, Role: ${adminData.data.user.role}`);

  const adminDashboardRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminDashboardJson = await adminDashboardRes.json();
  console.log(`✓ Admin access status code: ${adminDashboardRes.status} (Expected: 200)`);
  if (adminDashboardRes.status !== 200 || !adminDashboardJson.success) {
    throw new Error('Admin dashboard retrieval failed');
  }

  const d = adminDashboardJson.data;
  console.log('\n4. Verifying Dashboard Payload:');
  console.log('  Overview Cards:');
  console.log(`    - Students: ${d.overview.students.total} (${d.overview.students.growth})`);
  console.log(`    - Bookings: ${d.overview.bookings.total} (${d.overview.bookings.growth})`);
  console.log(`    - Courses: ${d.overview.courses.total} total, ${d.overview.courses.published} published`);
  console.log(`    - Workshops: ${d.overview.workshops.total} (${d.overview.workshops.averageOccupancy} occupancy)`);
  console.log(`    - Memberships: ${d.overview.memberships.activeMembers} active members`);
  console.log(`    - Revenue: ${d.overview.revenue.totalFormatted} (${d.overview.revenue.growth})`);
  console.log(`  Feeds:`);
  console.log(`    - Recent activity count: ${d.recentActivity.length}`);
  console.log(`    - Recent bookings count: ${d.recentBookings.length}`);
  console.log(`    - Upcoming workshops count: ${d.upcomingWorkshops.length}`);
  console.log(`    - New enquiries count: ${d.newEnquiries.length}`);

  console.log('\n======================================================');
  console.log('✓ ALL BACKEND ADMIN AUTHORIZATION TESTS PASSED');
  console.log('======================================================\n');
}

testAdminBackend().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
