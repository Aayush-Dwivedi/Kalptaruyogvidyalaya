import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import {
  Institute,
  Founder,
  HeroSlide,
  Course,
  Workshop,
  Video,
  Benefit,
} from '../models';

async function updateApprovedContent(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB for content update...');
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB.');

    // 1. Institute
    await Institute.findOneAndUpdate(
      {},
      {
        $set: {
          name: 'Kalptaru Yog Vidyalaya',
          tagline: 'Traditional Yoga & Wellness',
          description:
            'Our programs include general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses. We combine traditional yoga practices with physiotherapy expertise, making our approach both effective and safe for everyone.',
          mission:
            'Affiliated by Indian Yoga Association. Authentic traditional yogic practices combined with physiotherapy expertise.',
          vision:
            'Holistic mind, body & spirit well-being safe and effective for everyone.',
          philosophy:
            'Combining traditional yoga practices with physiotherapy expertise.',
          history:
            'Founded by Mrs. Shuchi Mohan, Physiotherapist and Therapeutic Yoga Consultant.',
          contact: {
            email: 'shuchimohan@kalptaruyogvidyalaya.com',
            phone: '09818047984',
            alternatePhone: '',
            address: {
              street: 'N114 Piyush Heights, Sector 89',
              city: 'Faridabad',
              state: 'Haryana',
              postalCode: '121002',
              country: 'India',
              mapUrl: 'https://maps.google.com',
            },
            hours: 'Mon – Sat: 06:00 AM – 08:00 PM',
          },
          stats: [
            { label: 'Happy Students', value: '5000+', detail: 'Traditional Learning', order: 1 },
            { label: 'Years Experience', value: '15+', detail: 'Clinical & Yogic', order: 2 },
            { label: 'Programs Offered', value: 'Multiple', detail: 'Wellness & Therapy', order: 3 },
          ],
        },
      },
      { upsert: true }
    );
    logger.info('✓ Institute content updated.');

    // 2. Founder - Mrs. Shuchi Mohan
    const founderData = {
      name: 'Mrs. Shuchi Mohan',
      title: 'Founder & Lead Instructor',
      designation: 'Physiotherapist & Therapeutic Yoga Consultant',
      slug: 'shuchi-mohan',
      bio: 'My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care. Over time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications.',
      biography:
        'My professional journey began in Physiotherapy, where I developed clinical expertise in rehabilitation and patient care.\n\nOver time, my interest in holistic healing led me toward Yoga Therapy and its integrative applications.\n\nI further expanded my practice during my professional tenure at Morarji Desai National Institute of Yoga (MDNIY), where I gained institutional exposure through yoga therapy sessions and wellness programs conducted for uniformed personnel, along with engagements associated with various government ministries.\n\nMy work has also included invited wellness sessions and live programs in association with NCERT, as well as participation in national and international conferences and institutional events.\n\nI now carry this integrated approach of Physiotherapy and Yoga forward through my independent institute, Kalptaru Yog Vidyalaya.',
      shortBio: 'Physiotherapist & Therapeutic Yoga Consultant, Founder & Lead Instructor of Kalptaru Yog Vidyalaya.',
      quote: 'The photographs featured here reflect my professional and institutional experience.',
      message: 'The photographs featured here reflect my professional and institutional experience.',
      qualifications: [
        'Physiotherapist',
        'Therapeutic Yoga Consultant',
        'Former Practitioner at Morarji Desai National Institute of Yoga (MDNIY)',
        'NCERT Live Program Resource Expert',
      ],
      achievements: [
        'Yoga therapy & wellness programs for uniformed personnel at MDNIY',
        'Invited wellness sessions & live programs in association with NCERT',
        'Participation in national and international conferences & institutional events',
        'Founder & Lead Instructor of Kalptaru Yog Vidyalaya',
      ],
      specializations: ['Therapeutic Yoga', 'Physiotherapy & Rehabilitation', 'Post-Cancer Recovery', 'Thyroid & Back Pain Special Care'],
      lineage: 'Traditional Yoga Practices Combined with Physiotherapy Expertise',
      experienceYears: 15,
      order: 1,
      status: 'published',
      featured: true,
    };

    const existingFounder = await Founder.findOne();
    let founderDoc;
    if (existingFounder) {
      founderDoc = await Founder.findByIdAndUpdate(existingFounder._id, { $set: founderData }, { new: true });
    } else {
      founderDoc = await Founder.create(founderData);
    }
    logger.info('✓ Founder Mrs. Shuchi Mohan updated.');

    // 3. Hero Slides
    const heroSlides = await HeroSlide.find();
    if (heroSlides.length > 0) {
      for (const slide of heroSlides) {
        slide.heading = 'Kalptaru Yog Vidyalaya';
        slide.subheading = 'Traditional Yoga & Wellness';
        slide.description =
          'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.';
        slide.quote = 'Affiliated by Indian Yoga Association';
        slide.ctaText = 'Explore Courses';
        slide.ctaUrl = '/programs/courses';
        slide.secondaryCtaText = 'Contact Us';
        slide.secondaryCtaUrl = '/contact';
        await slide.save();
      }
    }
    logger.info('✓ Hero slides updated.');

    // 4. Courses
    const approvedCourses = [
      {
        title: 'Yoga for Wellness: Foundation Course',
        slug: 'yoga-for-wellness-foundation-course',
        shortDescription:
          'A carefully designed program that makes the profound benefits of authentic yoga accessible.',
        description:
          'A carefully designed program that makes the profound benefits of authentic yoga accessible.',
        duration: '50 Hours',
        level: 'all-levels',
        mode: 'in-person',
        price: {
          amount: 0,
          currency: 'INR',
          displayPrice: '',
        },
        features: [
          'Authentic traditional yogic practices',
          'Physiotherapy and postural alignment',
          'Safe and supportive guidance for everyone',
        ],
        curriculum: [
          {
            moduleNumber: 1,
            title: 'Foundation Asanas & Biomechanics',
            topics: ['Traditional Postures', 'Physiotherapy Alignment', 'Joint Health'],
          },
        ],
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Founder & Lead Instructor',
          founderRef: founderDoc?._id,
        },
        certification: 'Kalptaru Yog Vidyalaya Certification',
        order: 1,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yogasana Certification',
        slug: 'yogasana-certification',
        shortDescription:
          'Certificate course providing a strong foundation in traditional yogasanas with correct alignment.',
        description:
          'Certificate course providing a strong foundation in traditional yogasanas with correct alignment.',
        duration: '120 Hours',
        level: 'all-levels',
        mode: 'in-person',
        price: {
          amount: 14500,
          currency: 'INR',
          displayPrice: '₹14,500',
        },
        features: [
          'Strong foundation in traditional yogasanas',
          'Detailed anatomical and alignment guidance',
          'Recognized certificate upon successful completion',
        ],
        curriculum: [
          {
            moduleNumber: 1,
            title: 'Traditional Yogasana Mastery',
            topics: ['Alignment Principles', 'Postural Adjustments', 'Injury Prevention'],
          },
        ],
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Founder & Lead Instructor',
          founderRef: founderDoc?._id,
        },
        certification: 'Kalptaru Yog Vidyalaya Certification',
        order: 2,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga After Breast Cancer: A Healing Journey',
        slug: 'yoga-after-breast-cancer-healing-journey',
        shortDescription:
          '2-Day Specialized Yoga Therapy Workshop for post-cancer recovery with scientific and...',
        description:
          '2-Day Specialized Yoga Therapy Workshop for post-cancer recovery with scientific and...',
        duration: '2 Days',
        level: 'all-levels',
        mode: 'in-person',
        price: {
          amount: 3500,
          currency: 'INR',
          displayPrice: '₹3,500',
        },
        features: [
          '2-Day Specialized Yoga Therapy Workshop by Dr Shuchi Mohan',
          'Gentle movement and rehabilitation support',
          'Safe therapeutic protocols for recovery',
        ],
        curriculum: [
          {
            moduleNumber: 1,
            title: 'Gentle Therapeutic Care',
            topics: ['Lymphatic & Tissue Health', 'Gentle Range of Motion', 'Restorative Breathing'],
          },
        ],
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Founder & Lead Instructor',
          founderRef: founderDoc?._id,
        },
        certification: 'Certificate of Participation',
        order: 3,
        featured: true,
        status: 'published',
      },
    ];

    for (const c of approvedCourses) {
      await Course.findOneAndUpdate(
        { slug: c.slug },
        { $set: c },
        { upsert: true, new: true }
      );
    }
    logger.info('✓ Courses updated.');

    // 5. Workshops
    const approvedWorkshops = [
      {
        title: 'THYROID SPECIAL WORKSHOP',
        slug: 'thyroid-special-workshop',
        shortDescription: 'Thyroid care',
        description: 'Thyroid care',
        duration: '1 Hr',
        startTime: '10:00 AM',
        endTime: '11:00 AM',
        mode: 'in-person',
        date: new Date('2026-10-25T10:00:00.000Z'),
        location: {
          venue: 'Kalptaru Yog Vidyalaya Shala',
          city: 'Faridabad',
        },
        capacity: {
          total: 30,
          booked: 5,
        },
        price: {
          amount: 0,
          currency: 'INR',
          displayPrice: '',
        },
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Physiotherapist & Therapeutic Yoga Consultant',
          founderRef: founderDoc?._id,
        },
        order: 1,
        featured: true,
        status: 'published',
      },
      {
        title: 'BACK PAIN SPECIAL WORKSHOP',
        slug: 'back-pain-special-workshop',
        shortDescription: 'Free workshop for all age group',
        description: 'Free workshop for all age group',
        duration: '1 Hr',
        startTime: '11:30 AM',
        endTime: '12:30 PM',
        mode: 'in-person',
        date: new Date('2026-11-01T11:30:00.000Z'),
        location: {
          venue: 'Kalptaru Yog Vidyalaya Shala',
          city: 'Faridabad',
        },
        capacity: {
          total: 35,
          booked: 12,
        },
        price: {
          amount: 0,
          currency: 'INR',
          displayPrice: 'Free',
        },
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Physiotherapist & Therapeutic Yoga Consultant',
          founderRef: founderDoc?._id,
        },
        order: 2,
        featured: true,
        status: 'published',
      },
      {
        title: 'PRE NATAL & POST NATAL YOGA CARE',
        slug: 'pre-natal-post-natal-yoga-care',
        shortDescription: 'Safe yoga poses for pregnancy (pre and post natal)',
        description: 'Safe yoga poses for pregnancy (pre and post natal)',
        duration: '1 Hr',
        startTime: '04:00 PM',
        endTime: '05:00 PM',
        mode: 'in-person',
        date: new Date('2026-11-15T16:00:00.000Z'),
        location: {
          venue: 'Kalptaru Yog Vidyalaya Shala',
          city: 'Faridabad',
        },
        capacity: {
          total: 25,
          booked: 8,
        },
        price: {
          amount: 0,
          currency: 'INR',
          displayPrice: '',
        },
        instructor: {
          name: 'Mrs. Shuchi Mohan',
          title: 'Physiotherapist & Therapeutic Yoga Consultant',
          founderRef: founderDoc?._id,
        },
        order: 3,
        featured: true,
        status: 'published',
      },
    ];

    for (const ws of approvedWorkshops) {
      await Workshop.findOneAndUpdate(
        { slug: ws.slug },
        { $set: ws },
        { upsert: true, new: true }
      );
    }
    logger.info('✓ Workshops updated.');

    // 6. Videos - 6 NCERT Platform sessions
    const approvedVideos = [
      {
        title: 'Yoga for Sinusitis',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 1,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga for Sciatica',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 2,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga for Obesity',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 3,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga for Adolescence',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 4,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga for Improving Thyroid',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 5,
        featured: true,
        status: 'published',
      },
      {
        title: 'Yoga for Exam Worrier',
        description: 'Live Yoga & Interactive Session with Experts',
        category: 'Expert Yoga Session for NCERT Platform',
        speaker: 'Mrs. Shuchi Mohan',
        duration: 'Expert Session',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        youtubeVideoId: 'dQw4w9WgXcQ',
        order: 6,
        featured: true,
        status: 'published',
      },
    ];

    await Video.deleteMany({});
    await Video.insertMany(approvedVideos);
    logger.info('✓ Videos updated.');

    // 7. Benefits
    const approvedBenefits = [
      {
        title: 'Physical Resilience & Vitality',
        sanskritTerm: 'Sharirik Swasthya & Urja',
        description:
          'Builds natural strength, flexibility, and stability. Improves posture, balance, and joint health. Increases energy levels and supports deep, restful sleep. Supports pain management (back pain, fatigue, stiffness). Strengthens the mind-body-consciousness connection.',
        scriptureRef: 'Asana & Biomechanics',
        order: 1,
        status: 'published',
      },
      {
        title: 'Mental Clarity & Emotional Balance',
        sanskritTerm: 'Manas Shanti & Samatvam',
        description:
          'Stability in movement, stillness in chaos, and balance in life. Nurtures resilience without rigidity, strength without aggression, and discipline without pressure — creating sustainable wellness that flows into daily life.',
        scriptureRef: 'Sadhana & Mind',
        order: 2,
        status: 'published',
      },
      {
        title: 'Therapeutic Yoga Process',
        sanskritTerm: 'Chikitsa & Sharir',
        description:
          'Through conscious movement and steady postures (asanas), yoga strengthens muscles, releases stored tension, improves circulation, and awakens body awareness. It harmonizes the nervous system and restores the natural rhythm of rest and activity.',
        scriptureRef: 'Therapeutic Yoga',
        order: 3,
        status: 'published',
      },
      {
        title: 'Holistic Mind, Body & Spirit',
        sanskritTerm: 'Sharir, Prana, Chitta',
        description:
          'Rooted in ancient Indian wisdom and supported by modern science, yoga weaves together body (sharir), breath (prana), mind, and consciousness. A disciplined routine becomes the foundation for a calm mind and strong body.',
        scriptureRef: 'Holistic Science',
        order: 4,
        status: 'published',
      },
      {
        title: 'A Conscious Way of Living',
        sanskritTerm: 'Sadhana',
        description:
          'For students, professionals, homemakers, elders, and seekers alike, yoga offers more than fitness — it offers a way of living. Not a workout. Not a trend. Not a hobby. Yoga is a way of life.',
        scriptureRef: 'Way of Living',
        order: 5,
        status: 'published',
      },
      {
        title: 'In Essence: Path of Balance',
        sanskritTerm: 'Inner Union',
        description:
          'A path that builds: Strength in the body - Stillness in the mind - Balance in emotions - Clarity in decisions - Peace in the soul.',
        scriptureRef: 'Vidyalaya Essence',
        order: 6,
        status: 'published',
      },
    ];

    await Benefit.deleteMany({});
    await Benefit.insertMany(approvedBenefits);
    logger.info('✓ Benefits updated.');

    logger.info('=== All database collections updated with approved Kalptaru content successfully ===');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Failed to update approved content:', err);
    process.exit(1);
  }
}

updateApprovedContent();
