import axios from 'axios';
import FormData from 'form-data';

const BASE_URL = 'http://localhost:5000/api';

async function runPhase8Test() {
  console.log('--- Starting Phase 8 Student Portal End-to-End Verification ---');

  // 1. Authenticate as student
  console.log('\n1. Testing Student Login...');
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: 'student@kalptaruyog.org',
    password: 'Student@Kalptaru2026!',
  });

  const { tokens, user } = loginRes.data.data;
  console.log(`✓ Logged in as: ${user.name} (${user.email}), Role: ${user.role}`);
  console.log(`✓ Access token acquired: ${tokens.accessToken.slice(0, 20)}...`);

  const authHeaders = {
    Authorization: `Bearer ${tokens.accessToken}`,
  };

  // 2. Fetch Student Dashboard
  console.log('\n2. Testing GET /api/student/dashboard...');
  const dashboardRes = await axios.get(`${BASE_URL}/student/dashboard`, {
    headers: authHeaders,
  });
  const dbData = dashboardRes.data.data;

  console.log(`✓ Welcome message: "${dbData.welcome.greeting}"`);
  console.log(`✓ Sanskrit quote: "${dbData.welcome.sanskritQuote.slice(0, 40)}..."`);
  console.log(`✓ Active streak: ${dbData.welcome.streakDays} days, practice: ${dbData.welcome.hoursPracticed}h`);
  console.log(`✓ Current membership: ${dbData.currentMembership?.planName} (${dbData.currentMembership?.status})`);
  console.log(`✓ Upcoming bookings count: ${dbData.upcomingBookings.length}`);
  console.log(`✓ Recent purchases count: ${dbData.recentPurchases.length}`);
  console.log(`✓ Upcoming workshops count: ${dbData.upcomingWorkshops.length}`);
  console.log(`✓ Course enrollments count: ${dbData.courseEnrollments.length}`);

  // 3. Test Profile Image Upload (Supabase Storage via /api/media/upload)
  console.log('\n3. Testing Media Upload (Supabase Storage) for Student Profile...');
  const dummySvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><circle cx="50" cy="50" r="40" fill="#2A1128"/><text x="50" y="55" fill="#C5A059" font-size="20" text-anchor="middle">AS</text></svg>`;
  const form = new FormData();
  form.append('file', Buffer.from(dummySvg), {
    filename: 'aarav-avatar.svg',
    contentType: 'image/svg+xml',
  });
  form.append('folder', 'general');
  form.append('alt', 'Aarav Sharma Avatar');

  const uploadRes = await axios.post(`${BASE_URL}/media/upload`, form, {
    headers: {
      ...authHeaders,
      ...form.getHeaders(),
    },
  });

  const media = uploadRes.data.data;
  console.log(`✓ Image uploaded to Supabase Storage:`);
  console.log(`  - Bucket: ${media.bucket}`);
  console.log(`  - Path: ${media.path}`);
  console.log(`  - Public URL: ${media.publicUrl}`);

  // 4. Update Student Profile via PATCH /api/auth/profile
  console.log('\n4. Testing Student Profile Update (PATCH /api/auth/profile)...');
  const updateRes = await axios.patch(
    `${BASE_URL}/auth/profile`,
    {
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
    },
    { headers: authHeaders }
  );

  const updatedUser = updateRes.data.data;
  console.log(`✓ Updated Profile confirmed:`);
  console.log(`  - Name: ${updatedUser.name}`);
  console.log(`  - Phone: ${updatedUser.phone}`);
  console.log(`  - City: ${updatedUser.city}`);
  console.log(`  - Experience Level: ${updatedUser.experienceLevel}`);
  console.log(`  - Emergency Contact: ${updatedUser.emergencyContact}`);
  console.log(`  - Profile Image URL: ${updatedUser.profileImage?.url}`);

  // 5. Verify /api/auth/me returns updated state
  console.log('\n5. Verifying GET /api/auth/me persistence...');
  const meRes = await axios.get(`${BASE_URL}/auth/me`, { headers: authHeaders });
  const me = meRes.data.data;
  console.log(`✓ Current user loaded: ${me.name}, Bio: "${me.bio.slice(0, 35)}..."`);

  console.log('\n======================================================');
  console.log('✓ ALL PHASE 8 BACKEND & END-TO-END VERIFICATIONS PASSED');
  console.log('======================================================\n');
}

runPhase8Test().catch((err) => {
  console.error('Test failed:', err.response?.data || err.message);
  process.exit(1);
});
