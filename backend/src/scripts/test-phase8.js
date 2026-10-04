// Pure Node 18+ native fetch test script
const BASE_URL = 'http://localhost:5000/api';

async function runPhase8Test() {
  console.log('--- Starting Phase 8 Student Portal End-to-End Verification ---');

  // 1. Authenticate as student
  console.log('\n1. Testing Student Login...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'student@kalptaruyog.org',
      password: 'Student@Kalptaru2026!',
    }),
  });

  const loginJson = await loginRes.json();
  if (!loginJson.success) {
    throw new Error(`Login failed: ${loginJson.message}`);
  }

  const { tokens, user } = loginJson.data;
  console.log(`✓ Logged in as: ${user.name} (${user.email}), Role: ${user.role}`);
  console.log(`✓ Access token acquired: ${tokens.accessToken.slice(0, 20)}...`);

  const authHeaders = {
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  // 2. Fetch Student Dashboard
  console.log('\n2. Testing GET /api/student/dashboard...');
  const dashboardRes = await fetch(`${BASE_URL}/student/dashboard`, {
    headers: authHeaders,
  });
  const dbJson = await dashboardRes.json();
  if (!dbJson.success) {
    throw new Error(`Dashboard retrieval failed: ${dbJson.message}`);
  }
  const dbData = dbJson.data;

  console.log(`✓ Welcome message: "${dbData.welcome.greeting}"`);
  console.log(`✓ Sanskrit quote: "${dbData.welcome.sanskritQuote.slice(0, 45)}..."`);
  console.log(`✓ Active streak: ${dbData.welcome.streakDays} days, practice: ${dbData.welcome.hoursPracticed}h`);
  console.log(`✓ Current membership: ${dbData.currentMembership?.planName} (${dbData.currentMembership?.status})`);
  console.log(`✓ Upcoming bookings count: ${dbData.upcomingBookings.length}`);
  console.log(`✓ Recent purchases count: ${dbData.recentPurchases.length}`);
  console.log(`✓ Upcoming workshops count: ${dbData.upcomingWorkshops.length}`);
  console.log(`✓ Course enrollments count: ${dbData.courseEnrollments.length}`);

  // 3. Test Media Upload (Supabase Storage via /api/media/upload)
  console.log('\n3. Testing Media Upload (Supabase Storage) for Student Profile...');
  const dummySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#2A1128"/><text x="50" y="55" fill="#C5A059" font-size="20" text-anchor="middle">AS</text></svg>`;
  const blob = new Blob([dummySvg], { type: 'image/svg+xml' });
  const form = new FormData();
  form.append('file', blob, 'aarav-avatar.svg');
  form.append('folder', 'general');
  form.append('alt', 'Aarav Sharma Avatar');

  const uploadRes = await fetch(`${BASE_URL}/media/upload`, {
    method: 'POST',
    headers: authHeaders,
    body: form,
  });
  const uploadJson = await uploadRes.json();
  if (!uploadJson.success) {
    throw new Error(`Media upload failed: ${uploadJson.message}`);
  }

  const media = uploadJson.data;
  console.log(`✓ Image uploaded to Supabase Storage:`);
  console.log(`  - Bucket: ${media.bucket}`);
  console.log(`  - Path: ${media.path}`);
  console.log(`  - Public URL: ${media.publicUrl}`);

  // 4. Update Student Profile via PATCH /api/auth/profile
  console.log('\n4. Testing Student Profile Update (PATCH /api/auth/profile)...');
  const updateRes = await fetch(`${BASE_URL}/auth/profile`, {
    method: 'PATCH',
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Aarav Sharma',
      phone: '+91 98765 00002',
      profileImage: {
        url: media.publicUrl,
        path: media.path,
        bucket: media.bucket,
        size: media.size,
        mimeType: media.mimeType,
        alt: media.alt,
      },
      bio: 'Dedicated sadhaka practicing classical Hatha yoga and Ashtanga vinyasa since 2023. Preparing for 200-Hour TTC.',
      city: 'Pune',
      address: 'Flat 402, Lotus Residency, Baner, Pune - 411045',
      experienceLevel: 'intermediate',
      emergencyContact: 'Meera Sharma (+91 98765 00003)',
    }),
  });

  const updateJson = await updateRes.json();
  if (!updateJson.success) {
    throw new Error(`Profile update failed: ${updateJson.message}`);
  }

  const updatedUser = updateJson.data;
  console.log(`✓ Updated Profile confirmed:`);
  console.log(`  - Name: ${updatedUser.name}`);
  console.log(`  - Phone: ${updatedUser.phone}`);
  console.log(`  - City: ${updatedUser.city}`);
  console.log(`  - Experience Level: ${updatedUser.experienceLevel}`);
  console.log(`  - Emergency Contact: ${updatedUser.emergencyContact}`);
  console.log(`  - Profile Image URL: ${updatedUser.profileImage?.url}`);

  // 5. Verify /api/auth/me returns updated state
  console.log('\n5. Verifying GET /api/auth/me persistence...');
  const meRes = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
  const meJson = await meRes.json();
  const me = meJson.data;
  console.log(`✓ Current user loaded: ${me.name}, Bio: "${me.bio.slice(0, 35)}..."`);

  console.log('\n======================================================');
  console.log('✓ ALL PHASE 8 BACKEND & END-TO-END VERIFICATIONS PASSED');
  console.log('======================================================\n');
}

runPhase8Test().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
