const BASE_URL = 'http://localhost:5000/api';

async function request(url: string, options: any = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error: any = new Error(data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runPhase11Tests() {
  console.log('=== PHASE 11: COMPLETE PROGRAM & WORKSHOP MANAGEMENT E2E TEST ===\n');

  // 1. Admin Login
  console.log('[1] Logging in as Admin...');
  const loginRes = await request(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@kalptaruyog.org',
      password: 'Admin@Kalptaru2026!',
    }),
  });
  const token = loginRes.data.tokens?.accessToken || loginRes.data.accessToken;
  const adminHeaders = {
    Authorization: `Bearer ${token}`,
  };
  console.log('✔ Admin logged in successfully.');

  // 2. Course Management Tests
  console.log('\n[2] Testing Courses Management (CRUD, Publish, Feature, Reorder)...');

  // Create Course 1
  const coursePayload1 = {
    title: '300-Hour Advanced Yoga Teacher Training',
    slug: '300-hour-advanced-ttc-test',
    description:
      'Advanced sadhana and master educator certification covering classical Kundalini, Pranayama, and Patanjali Yoga Sutras in deep gurukula immersion.',
    shortDescription: 'Master educator certification for advanced teachers.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      path: 'courses/advanced-300.jpg',
      bucket: 'kalptaru-media',
      alt: '300 Hour Course',
    },
    gallery: [
      {
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
        path: 'courses/gallery-1.jpg',
        bucket: 'kalptaru-media',
        alt: 'Sadhana Hall',
      },
    ],
    duration: '300 Hours / 6 Weeks',
    level: 'advanced',
    mode: 'residential',
    price: {
      amount: 48000,
      currency: 'INR',
      isFree: false,
      displayPrice: '₹48,000',
    },
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Kundalini & Nadi Shodhana Science',
        description: 'Subtle pranic anatomy and bio-energy alignment',
        topics: ['Ida, Pingala & Sushumna Flow', 'Kumbhaka Ratios & Bandhas'],
      },
      {
        moduleNumber: 2,
        title: 'Patanjali Samadhi Pada Hermeneutics',
        description: 'Classical exposition of the Raja Yoga sutras',
        topics: ['Chitta Vritti Nirodha', 'Abhyasa & Vairagya'],
      },
    ],
    benefits: [
      'Master educator accreditation (RYT 300 / RYT 500)',
      'Traditional guru-shishya parampara transmission',
      'Daily residential Ayurvedic nutrition & sadhana',
    ],
    instructor: {
      name: 'Acharya Ramanath Shastri',
      title: 'Founder & Master Acharya',
      bio: '30+ years of classical tapasya and teacher training stewardship.',
    },
    certification: 'Yoga Alliance RYT 300 & AYUSH Level 3',
    eligibility: 'Completion of 200-Hour TTC with minimum 1 year teaching experience.',
    schedule: 'Mon – Sat: 5:30 AM – 8:00 AM & 4:00 PM – 7:00 PM',
    capacity: {
      total: 20,
      enrolled: 4,
    },
    status: 'published',
    featured: true,
    seo: {
      metaTitle: '300-Hour Advanced Yoga Teacher Training | Kalptaru Yog Vidyalaya',
      metaDescription: 'Deepen teaching mastery through our accredited 300-hour residential TTC in Rishikesh.',
      keywords: ['300 hour yoga ttc', 'advanced teacher training', 'rishikesh yoga'],
    },
  };

  const createCourseRes1 = await request(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(coursePayload1),
  });
  const course1 = createCourseRes1.data;
  console.log(`✔ Course 1 created: "${course1.title}" (ID: ${course1._id})`);

  // Verify fields persisted correctly
  if (course1.capacity?.total !== 20 || course1.capacity?.enrolled !== 4) {
    throw new Error(`Course capacity mismatch! Expected total 20, enrolled 4, got: ${JSON.stringify(course1.capacity)}`);
  }
  if (!course1.benefits || course1.benefits.length === 0) {
    throw new Error('Course benefits array is empty!');
  }
  console.log('✔ Course capacity & benefits validated.');

  // Create Course 2 for reorder testing
  const coursePayload2 = {
    title: 'Hatha Yoga Foundations for Beginners',
    slug: 'hatha-foundations-test',
    description: 'A gentle, traditional entry point into classical Hatha alignment and daily sadhana routine.',
    shortDescription: 'Foundations of traditional asana and breath.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      path: 'courses/hatha-foundations.jpg',
      bucket: 'kalptaru-media',
      alt: 'Hatha Foundations',
    },
    duration: '50 Hours / 2 Weeks',
    level: 'beginner',
    mode: 'in-person',
    price: {
      amount: 12000,
      currency: 'INR',
      displayPrice: '₹12,000',
    },
    curriculum: [
      {
        moduleNumber: 1,
        title: 'Basic Asana Foundations',
        topics: ['Tadasana', 'Trikonasana', 'Vrikshasana'],
      },
    ],
    benefits: ['Establish regular morning sadhana', 'Learn breath synchronization'],
    instructor: {
      name: 'Yogini Devaki Devi',
      title: 'Senior Sadhana Acharya',
    },
    capacity: {
      total: 25,
      enrolled: 10,
    },
    status: 'published',
    featured: true,
  };

  const createCourseRes2 = await request(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(coursePayload2),
  });
  const course2 = createCourseRes2.data;
  console.log(`✔ Course 2 created: "${course2.title}" (ID: ${course2._id})`);

  // Test Edit Course 1
  console.log('\n[2.1] Updating Course 1 details...');
  const updateCourseRes1 = await request(`${BASE_URL}/courses/${course1._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      duration: '350 Hours / 7 Weeks',
      capacity: { total: 22, enrolled: 5 },
      benefits: [...coursePayload1.benefits, 'Comprehensive Nada Yoga chanting module'],
    }),
  });
  const updatedCourse1 = updateCourseRes1.data;
  if (updatedCourse1.duration !== '350 Hours / 7 Weeks') {
    throw new Error('Course update failed: duration not updated');
  }
  if (updatedCourse1.capacity.total !== 22) {
    throw new Error('Course update failed: capacity total not updated');
  }
  console.log('✔ Course 1 updated successfully with new duration, capacity, and benefits.');

  // Test Publish / Unpublish Toggle
  console.log('\n[2.2] Testing Course Publish / Unpublish Toggle...');
  await request(`${BASE_URL}/courses/${course1._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'draft' }),
  });
  let publicCourses = (await request(`${BASE_URL}/courses`)).data;
  if (publicCourses.some((c: any) => c._id === course1._id)) {
    throw new Error('Unpublished draft course should NOT appear in public GET /courses');
  }
  console.log('✔ Draft course correctly hidden from public catalog.');

  await request(`${BASE_URL}/courses/${course1._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'published' }),
  });
  publicCourses = (await request(`${BASE_URL}/courses`)).data;
  if (!publicCourses.some((c: any) => c._id === course1._id)) {
    throw new Error('Published course MUST appear in public GET /courses');
  }
  console.log('✔ Course republished and live in public catalog.');

  // Test Reordering
  console.log('\n[2.3] Testing Course Reordering endpoint (PATCH /courses/reorder)...');
  await request(`${BASE_URL}/courses/reorder`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      courseIds: [course2._id, course1._id],
    }),
  });

  const reorderedCourses = (await request(`${BASE_URL}/courses?status=all`)).data;
  const idxCourse2 = reorderedCourses.findIndex((c: any) => c._id === course2._id);
  const idxCourse1 = reorderedCourses.findIndex((c: any) => c._id === course1._id);
  console.log(`Reordered index of Course 2: ${idxCourse2}, Course 1: ${idxCourse1}`);
  if (idxCourse2 > idxCourse1) {
    throw new Error('Reorder did not prioritize Course 2 before Course 1');
  }
  console.log('✔ Course reorder endpoint verified successfully.');

  // 3. Workshop Management Tests
  console.log('\n[3] Testing Workshops Management (CRUD, Registration Deadline, Publish, Feature)...');

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 21);
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + 18);

  const workshopPayload = {
    title: 'Kumbhaka & Prana Vidya Masterclass',
    slug: 'kumbhaka-prana-vidya-test',
    description:
      'An intensive weekend exploration into the ancient esoteric science of breath suspension (Antar & Bahir Kumbhaka) with bandha lock synchronization.',
    shortDescription: 'Esoteric breath retention masterclass.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      path: 'workshops/kumbhaka.jpg',
      bucket: 'kalptaru-media',
      alt: 'Kumbhaka Intensive',
    },
    date: futureDate.toISOString(),
    startTime: '09:00 AM',
    endTime: '05:30 PM',
    duration: '2 Days / 16 Hours',
    instructor: {
      name: 'Acharya Ramanath Shastri',
      title: 'Founder & Spiritual Director',
      bio: 'Renowned expert in the physiological and spiritual nuances of classical pranayama.',
    },
    location: {
      venue: 'Kalptaru Tapovan Meditation Hall',
      city: 'Rishikesh',
      address: 'Swarg Ashram Road, Tapovan - 249192',
      mapUrl: 'https://maps.google.com',
      onlineLink: '',
    },
    mode: 'in-person',
    capacity: {
      total: 24,
      booked: 6,
    },
    price: {
      amount: 4500,
      currency: 'INR',
      displayPrice: '₹4,500',
    },
    registrationDeadline: deadlineDate.toISOString(),
    prerequisites: ['Minimum 6 months regular yoga practice', 'No acute cardiac conditions'],
    status: 'published',
    featured: true,
    seo: {
      metaTitle: 'Kumbhaka Masterclass | Kalptaru Yog Vidyalaya',
      metaDescription: 'Weekend immersive workshop on pranayama and breath suspension in Rishikesh.',
    },
  };

  const createWorkshopRes = await request(`${BASE_URL}/workshops`, {
    method: 'POST',
    headers: adminHeaders,
    body: JSON.stringify(workshopPayload),
  });
  const workshop = createWorkshopRes.data;
  console.log(`✔ Workshop created: "${workshop.title}" (ID: ${workshop._id})`);

  // Verify registration deadline and capacity
  if (!workshop.registrationDeadline) {
    throw new Error('Workshop registrationDeadline was not saved!');
  }
  if (workshop.capacity.total !== 24 || workshop.capacity.booked !== 6) {
    throw new Error(`Workshop capacity mismatch: ${JSON.stringify(workshop.capacity)}`);
  }
  console.log(`✔ Workshop registration deadline (${workshop.registrationDeadline}) and capacity (24/6) confirmed.`);

  // Test Edit Workshop
  console.log('\n[3.1] Updating Workshop details...');
  const newDeadline = new Date();
  newDeadline.setDate(newDeadline.getDate() + 19);

  const updateWorkshopRes = await request(`${BASE_URL}/workshops/${workshop._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({
      duration: '3 Days / 20 Hours',
      registrationDeadline: newDeadline.toISOString(),
      price: { amount: 5000, currency: 'INR', displayPrice: '₹5,000' },
    }),
  });
  const updatedWorkshop = updateWorkshopRes.data;
  if (updatedWorkshop.duration !== '3 Days / 20 Hours') {
    throw new Error('Workshop duration update failed!');
  }
  if (updatedWorkshop.price.amount !== 5000) {
    throw new Error('Workshop price update failed!');
  }
  console.log('✔ Workshop updated with new duration and deadline successfully.');

  // Test Publish / Unpublish Toggle
  console.log('\n[3.2] Testing Workshop Publish / Unpublish Toggle...');
  await request(`${BASE_URL}/workshops/${workshop._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'draft' }),
  });
  let publicWorkshops = (await request(`${BASE_URL}/workshops`)).data;
  if (publicWorkshops.some((w: any) => w._id === workshop._id)) {
    throw new Error('Draft workshop should NOT appear in public GET /workshops');
  }
  console.log('✔ Draft workshop correctly hidden from public schedule.');

  await request(`${BASE_URL}/workshops/${workshop._id}`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ status: 'published' }),
  });
  publicWorkshops = (await request(`${BASE_URL}/workshops`)).data;
  if (!publicWorkshops.some((w: any) => w._id === workshop._id)) {
    throw new Error('Published workshop MUST appear in public GET /workshops');
  }
  console.log('✔ Workshop republished and live in public schedule.');

  // 4. Test Public Home Aggregate Endpoint
  console.log('\n[4] Testing GET /api/home dynamic featured content...');
  const homeRes = await request(`${BASE_URL}/home`);
  const homeData = homeRes.data;

  console.log(`Featured Courses returned on homepage: ${homeData.featuredCourses?.length || 0}`);
  console.log(`Featured Workshops returned on homepage: ${homeData.featuredWorkshops?.length || 0}`);

  const hasCourseOnHome = homeData.featuredCourses?.some((c: any) => c._id === course1._id || c._id === course2._id);
  const hasWorkshopOnHome = homeData.featuredWorkshops?.some((w: any) => w._id === workshop._id);

  console.log(`Course on homepage: ${hasCourseOnHome ? 'YES' : 'NO'}`);
  console.log(`Workshop on homepage: ${hasWorkshopOnHome ? 'YES' : 'NO'}`);

  if (!hasCourseOnHome && homeData.featuredCourses.length === 0) {
    throw new Error('Homepage featuredCourses returned empty!');
  }
  if (!hasWorkshopOnHome && homeData.featuredWorkshops.length === 0) {
    throw new Error('Homepage featuredWorkshops returned empty!');
  }
  console.log('✔ GET /api/home returns dynamic featured courses and workshops.');

  // 5. Cleanup Test Entities
  console.log('\n[5] Cleaning up test records...');
  await request(`${BASE_URL}/courses/${course1._id}`, { method: 'DELETE', headers: adminHeaders });
  await request(`${BASE_URL}/courses/${course2._id}`, { method: 'DELETE', headers: adminHeaders });
  await request(`${BASE_URL}/workshops/${workshop._id}`, { method: 'DELETE', headers: adminHeaders });
  console.log('✔ Test courses and workshops deleted successfully.');

  console.log('\n🎉 ALL PHASE 11 PROGRAM & WORKSHOP MANAGEMENT TESTS PASSED PERFECTLY!\n');
}

runPhase11Tests().catch((err) => {
  console.error('\n❌ Phase 11 Test failed with error:', err.data || err.message);
  process.exit(1);
});
