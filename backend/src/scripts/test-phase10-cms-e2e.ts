const API_BASE = 'http://localhost:5000/api';

async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const errorMsg = data?.message || `HTTP ${res.status}: ${res.statusText}`;
    throw new Error(`${options.method || 'GET'} ${url} failed: ${errorMsg}`);
  }
  return data;
}

async function runPhase10CmsVerification() {
  console.log('====================================================');
  console.log('PHASE 10: ADMIN CONTENT MANAGEMENT SYSTEM VERIFICATION');
  console.log('====================================================\n');

  let adminToken = '';
  let createdHeroSlideId = '';
  let createdBenefitId = '';
  let createdGalleryImageId = '';
  let createdVideoId = '';

  try {
    // ----------------------------------------------------
    // 1. ADMIN AUTHENTICATION
    // ----------------------------------------------------
    console.log('[1/8] Authenticating Admin user (admin@kalptaruyog.org)...');
    const loginRes = await request(`${API_BASE}/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@kalptaruyog.org',
        password: 'Admin@Kalptaru2026!',
      }),
    });

    if (!loginRes.success || !loginRes.data.tokens?.accessToken) {
      throw new Error(`Admin login failed: ${JSON.stringify(loginRes)}`);
    }

    adminToken = loginRes.data.tokens.accessToken;
    const authHeaders = { Authorization: `Bearer ${adminToken}` };
    console.log('  ✓ Admin logged in successfully as:', loginRes.data.user.role);

    // ----------------------------------------------------
    // 2. HOMEPAGE CMS: HERO SLIDES
    // ----------------------------------------------------
    console.log('\n[2/8] Testing Homepage Hero Slide CMS...');
    const testSlidePayload = {
      heading: 'Phase 10 Sacred Sadhana Awakening',
      subheading: 'Lineage Immersion 2026',
      description: 'Dynamic CMS hero slide created by Admin without touching source code.',
      quote: '“Stillness is the portal to infinite consciousness.”',
      ctaText: 'Explore Sadhana',
      ctaUrl: '/programs/courses',
      secondaryCtaText: 'Contact Shala',
      secondaryCtaUrl: '/contact',
      order: 99,
      active: true,
      image: {
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920&q=85',
        path: 'hero/phase10-test-slide.jpg',
        bucket: 'kalptaru-media',
        alt: 'Phase 10 Sacred Sadhana',
      },
    };

    const createSlideRes = await request(`${API_BASE}/hero-slides`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testSlidePayload),
    });
    createdHeroSlideId = createSlideRes.data._id || createSlideRes.data.id;
    console.log('  ✓ Created new Hero Slide ID:', createdHeroSlideId);

    // Verify slide appears in Public GET /api/home
    const publicHomeAfterSlide = await request(`${API_BASE}/home`);
    const foundSlideInHome = publicHomeAfterSlide.data.heroSlides.some(
      (s: any) => (s._id === createdHeroSlideId || s.id === createdHeroSlideId)
    );
    if (!foundSlideInHome) {
      throw new Error('Created Hero Slide NOT found in public GET /api/home response!');
    }
    console.log('  ✓ Verified: Newly created Hero Slide appears in public GET /api/home!');

    // Update slide heading
    const updatedHeading = 'Phase 10 Hero Slide Modified Successfully';
    await request(`${API_BASE}/hero-slides/${createdHeroSlideId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ heading: updatedHeading }),
    });

    // Verify public GET /api/home reflects the updated heading
    const publicHomeAfterSlideUpdate = await request(`${API_BASE}/home`);
    const updatedSlideInHome = publicHomeAfterSlideUpdate.data.heroSlides.find(
      (s: any) => (s._id === createdHeroSlideId || s.id === createdHeroSlideId)
    );
    if (!updatedSlideInHome || updatedSlideInHome.heading !== updatedHeading) {
      throw new Error('Updated Hero Slide heading NOT reflected in public GET /api/home!');
    }
    console.log('  ✓ Verified: Modified Hero Slide heading reflected in public GET /api/home:', updatedSlideInHome.heading);

    // ----------------------------------------------------
    // 3. HOMEPAGE CMS: CTA
    // ----------------------------------------------------
    console.log('\n[3/8] Testing Homepage CTA Management...');
    const testCtaPayload = {
      badge: 'Admissions Open • Special Sadhana 2026',
      title: 'CMS Managed Sacred Potential Title',
      description: 'CMS managed description verified via public API.',
      primaryCtaText: 'Join Now (CMS)',
      primaryCtaUrl: '/programs',
      secondaryCtaText: 'Enquire (CMS)',
      secondaryCtaUrl: '/contact/enquiry',
    };

    await request(`${API_BASE}/home/cta`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(testCtaPayload),
    });
    console.log('  ✓ Updated Homepage CTA via PUT /api/home/cta');

    // Verify public GET /api/home returns updated CTA
    const publicHomeAfterCta = await request(`${API_BASE}/home`);
    const returnedCta = publicHomeAfterCta.data.homepageCta;
    if (returnedCta.title !== testCtaPayload.title || returnedCta.badge !== testCtaPayload.badge) {
      throw new Error(`Homepage CTA in GET /api/home mismatch: ${JSON.stringify(returnedCta)}`);
    }
    console.log('  ✓ Verified: Public GET /api/home reflects updated Homepage CTA:', returnedCta.title);

    // ----------------------------------------------------
    // 4. INSTITUTE CMS
    // ----------------------------------------------------
    console.log('\n[4/8] Testing Institute CMS...');
    const testInstitutePayload = {
      tagline: 'Ancient Wisdom for Modern Transformation (CMS Verified)',
      description: 'Preserving authentic classical Gurukula yoga stewardship since 2011.',
      mission: 'To impart sacred traditional Vedic yoga sadhana worldwide.',
      vision: 'A world grounded in cognitive stillness and inner transformation.',
      philosophy: 'Advaita Vedanta and classical Patanjali Ashtanga yoga.',
      contact: {
        email: 'admissions-cms@kalptaruyog.org',
        phone: '+91 98200 99999',
        address: {
          street: 'Kalptaru Tapovan Marg',
          city: 'Rishikesh',
          state: 'Uttarakhand',
          postalCode: '249192',
          country: 'India',
        },
        hours: 'Mon - Sat: 06:00 AM - 08:30 PM',
      },
    };

    await request(`${API_BASE}/institute`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(testInstitutePayload),
    });
    console.log('  ✓ Updated Institute details via PUT /api/institute');

    // Verify public GET /api/institute
    const publicInstituteRes = await request(`${API_BASE}/institute`);
    if (publicInstituteRes.data.tagline !== testInstitutePayload.tagline) {
      throw new Error('Institute tagline mismatch in public GET /api/institute!');
    }
    console.log('  ✓ Verified: Public GET /api/institute reflects updated Institute tagline:', publicInstituteRes.data.tagline);

    // ----------------------------------------------------
    // 5. FOUNDER CMS
    // ----------------------------------------------------
    console.log('\n[5/8] Testing Founder CMS...');
    const foundersRes = await request(`${API_BASE}/founders`);
    const founder = foundersRes.data[0];
    const founderId = founder._id || founder.id;

    const updatedFounderPayload = {
      designation: 'Founder, Acharya & Spiritual Director (CMS Updated)',
      biography: 'Dedicated to reviving classical gurukula tradition and transmitting authentic Patanjali Ashtanga sadhana.',
      message: '“True yoga is the dissolution of ego into quiet awareness.”',
      achievements: [
        'Recognized by AYUSH Ministry for Traditional Preservation',
        'Over 5,000 Sadhakas Graduated Worldwide',
        'Author of "The Unbroken Breath: Science of Kumbhaka"',
        'Keynote Speaker at International Yoga Festival',
      ],
    };

    await request(`${API_BASE}/founders/${founderId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify(updatedFounderPayload),
    });
    console.log('  ✓ Updated Founder profile via PATCH /api/founders/:id');

    // Verify public GET /api/founders
    const publicFoundersAfter = await request(`${API_BASE}/founders`);
    const updatedFounder = publicFoundersAfter.data.find(
      (f: any) => (f._id === founderId || f.id === founderId)
    );
    if (!updatedFounder || updatedFounder.title !== updatedFounderPayload.designation) {
      throw new Error('Founder title/designation mismatch in public GET /api/founders!');
    }
    console.log('  ✓ Verified: Public GET /api/founders reflects updated designation:', updatedFounder.title);

    // ----------------------------------------------------
    // 6. BENEFITS CMS (Full CRUD)
    // ----------------------------------------------------
    console.log('\n[6/8] Testing Benefits CMS (CRUD)...');
    const testBenefitPayload = {
      title: 'Cellular Vitality & Pranic Charge (CMS Test)',
      sanskritTerm: 'Prana Urja',
      description: 'Harmonizes intracellular mitochondria and increases pranic vitality across nadis.',
      scriptureRef: 'Yoga Vasistha (4.23)',
      icon: 'Zap',
      category: 'spiritual',
      order: 0,
      active: true,
    };

    const createBenefitRes = await request(`${API_BASE}/benefits`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testBenefitPayload),
    });
    createdBenefitId = createBenefitRes.data._id || createBenefitRes.data.id;
    console.log('  ✓ Created new Benefit ID:', createdBenefitId);

    // Verify benefit in public GET /api/home benefits list
    const publicHomeAfterBenefit = await request(`${API_BASE}/home`);
    const foundBenefitInHome = publicHomeAfterBenefit.data.benefits.some(
      (b: any) => (b._id === createdBenefitId || b.id === createdBenefitId)
    );
    if (!foundBenefitInHome) {
      throw new Error('Created Benefit NOT found in public GET /api/home!');
    }
    console.log('  ✓ Verified: Newly created Benefit appears in public GET /api/home!');

    // Toggle benefit active to false
    await request(`${API_BASE}/benefits/${createdBenefitId}`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ active: false }),
    });
    console.log('  ✓ Deactivated Benefit (active: false)');

    // Verify it is no longer returned in public GET /api/home
    const publicHomeAfterBenefitDeactivate = await request(`${API_BASE}/home`);
    const benefitStillInHome = publicHomeAfterBenefitDeactivate.data.benefits.some(
      (b: any) => (b._id === createdBenefitId || b.id === createdBenefitId)
    );
    if (benefitStillInHome) {
      throw new Error('Deactivated Benefit still appears in public GET /api/home!');
    }
    console.log('  ✓ Verified: Deactivated Benefit is excluded from public GET /api/home!');

    // ----------------------------------------------------
    // 7. MEDIA CMS: GALLERY & SUPABASE STORAGE
    // ----------------------------------------------------
    console.log('\n[7/8] Testing Gallery CMS with Supabase Storage...');
    // Create test gallery image metadata
    const testGalleryPayload = {
      title: 'Dawn Meditation on Ganges Ghats (CMS Test)',
      description: 'Morning meditation session photographed at sunrise.',
      event: 'Annual Sadhana Immersion',
      featured: true,
      order: 0,
      status: 'published',
      image: {
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
        path: 'gallery/dawn-ganges-test.jpg',
        bucket: 'kalptaru-media',
        alt: 'Dawn Meditation Ganges Ghats',
      },
    };

    const createGalleryRes = await request(`${API_BASE}/gallery`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testGalleryPayload),
    });
    createdGalleryImageId = createGalleryRes.data._id || createGalleryRes.data.id;
    console.log('  ✓ Created Gallery Image ID:', createdGalleryImageId);

    // Verify it appears in public GET /api/home gallery highlights
    const publicHomeAfterGallery = await request(`${API_BASE}/home`);
    const foundGalleryInHome = publicHomeAfterGallery.data.galleryHighlights.some(
      (g: any) => (g._id === createdGalleryImageId || g.id === createdGalleryImageId)
    );
    if (!foundGalleryInHome) {
      throw new Error('Created featured Gallery Image NOT found in public GET /api/home galleryHighlights!');
    }
    console.log('  ✓ Verified: Featured Gallery Image appears in public GET /api/home highlights!');

    // ----------------------------------------------------
    // 8. MEDIA CMS: VIDEOS
    // ----------------------------------------------------
    console.log('\n[8/8] Testing Videos CMS...');
    const testVideoPayload = {
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: 'Kumbhaka Breath Retention Masterclass (CMS Test)',
      description: 'Essential classical methods for internal and external breath retention.',
      category: 'Masterclass',
      speaker: 'Acharya Ramanath Shastri',
      duration: '22:15',
      featured: true,
      order: 0,
      status: 'published',
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85',
        path: 'videos/kumbhaka-masterclass.jpg',
        bucket: 'kalptaru-media',
        alt: 'Kumbhaka Masterclass',
      },
    };

    const createVideoRes = await request(`${API_BASE}/videos`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testVideoPayload),
    });
    createdVideoId = createVideoRes.data._id || createVideoRes.data.id;
    console.log('  ✓ Created Video ID:', createdVideoId);

    // Verify it appears in public GET /api/home featuredVideos
    const publicHomeAfterVideo = await request(`${API_BASE}/home`);
    const foundVideoInHome = publicHomeAfterVideo.data.featuredVideos.some(
      (v: any) => (v._id === createdVideoId || v.id === createdVideoId)
    );
    if (!foundVideoInHome) {
      throw new Error('Created featured Video NOT found in public GET /api/home featuredVideos!');
    }
    console.log('  ✓ Verified: Featured Video appears in public GET /api/home featuredVideos!');

    // ----------------------------------------------------
    // CLEANUP TEMPORARY TEST ENTITIES
    // ----------------------------------------------------
    console.log('\n[Cleanup] Cleaning up temporary test entities...');
    if (createdHeroSlideId) {
      await request(`${API_BASE}/hero-slides/${createdHeroSlideId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log('  ✓ Cleaned up test hero slide');
    }
    if (createdBenefitId) {
      await request(`${API_BASE}/benefits/${createdBenefitId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log('  ✓ Cleaned up test benefit');
    }
    if (createdGalleryImageId) {
      await request(`${API_BASE}/gallery/${createdGalleryImageId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log('  ✓ Cleaned up test gallery image');
    }
    if (createdVideoId) {
      await request(`${API_BASE}/videos/${createdVideoId}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
      console.log('  ✓ Cleaned up test video');
    }

    console.log('\n====================================================');
    console.log('SUCCESS: ALL PHASE 10 CMS ENDPOINTS & PUBLIC API');
    console.log('MUTATION RESPONSES VERIFIED PERFECTLY!');
    console.log('====================================================');
  } catch (error: any) {
    console.error('\n❌ Verification Failed:', error.message);
    process.exit(1);
  }
}

runPhase10CmsVerification();
