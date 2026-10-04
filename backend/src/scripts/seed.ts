import mongoose from 'mongoose';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import {
  Institute,
  Founder,
  HeroSlide,
  Program,
  Course,
  Workshop,
  CorporateProgram,
  MembershipPlan,
  GalleryCategory,
  GalleryImage,
  Video,
  Benefit,
  User,
} from '../models';

async function seedDatabase(): Promise<void> {
  try {
    logger.info('Connecting to MongoDB for seeding...');
    await mongoose.connect(env.MONGODB_URI);
    logger.info('Connected to MongoDB successfully.');

    // 1. Seed Institute
    const existingInstitute = await Institute.findOne();
    if (!existingInstitute) {
      await Institute.create({
        name: 'Kalptaru Yog Vidyalaya',
        tagline: 'Traditional Yoga & Wellness',
        mission:
          'Affiliated by Indian Yoga Association. Authentic traditional yogic practices combined with physiotherapy expertise, making our approach both effective and safe for everyone.',
        vision:
          'To provide general fitness yoga, therapeutic yoga for specific health conditions, and professional teacher training courses.',
        philosophy:
          'Combining traditional yoga practices with physiotherapy expertise.',
        history:
          'Founded by Mrs. Shuchi Mohan, Physiotherapist and Therapeutic Yoga Consultant.',
        establishedYear: 2011,
        accreditations: [
          {
            name: 'Affiliated by Indian Yoga Association',
            authority: 'Indian Yoga Association',
            certificateNumber: 'IYA-AFF-2022',
          },
        ],
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
        socialLinks: {
          instagram: '',
          youtube: '',
          facebook: '',
        },
        stats: [
          { label: 'Happy Students', value: '5000+', detail: 'Traditional Learning', order: 1 },
          { label: 'Years Experience', value: '15+', detail: 'Clinical & Yogic', order: 2 },
          { label: 'Programs Offered', value: 'Multiple', detail: 'Wellness & Therapy', order: 3 },
        ],
        branding: {
          logo: {
            url: '/logo.png',
            path: 'branding/logo.png',
            alt: 'Kalptaru Yog Vidyalaya Logo',
          },
        },
      });
      logger.info('✓ Institute profile created.');
    }

    // 2. Seed Founders
    const foundersCount = await Founder.countDocuments();
    let leadAcharya;
    if (foundersCount === 0) {
      leadAcharya = await Founder.create({
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
        image: {
          url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
          path: 'founders/shuchi-mohan.jpg',
          alt: 'Mrs. Shuchi Mohan',
        },
        lineage: 'Traditional Yoga Practices Combined with Physiotherapy Expertise',
        qualifications: [
          'Physiotherapist',
          'Therapeutic Yoga Consultant',
          'Former Practitioner at Morarji Desai National Institute of Yoga (MDNIY)',
          'NCERT Live Program Resource Expert',
        ],
        experienceYears: 15,
        specializations: ['Therapeutic Yoga', 'Physiotherapy & Rehabilitation', 'Post-Cancer Recovery', 'Thyroid & Back Pain Special Care'],
        order: 1,
        featured: true,
        status: 'published',
      });
      logger.info('✓ Founders seeded.');
    } else {
      leadAcharya = await Founder.findOne({ slug: 'shuchi-mohan' });
    }

    // 3. Seed Hero Slides
    const heroSlidesCount = await HeroSlide.countDocuments();
    if (heroSlidesCount === 0) {
      await HeroSlide.insertMany([
        {
          heading: 'Kalptaru Yog Vidyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          image: {
            url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1920&q=85',
            path: 'hero/slide-1.jpg',
            alt: 'Students practicing classical yoga in ashram',
          },
          order: 1,
          active: true,
        },
        {
          heading: 'Kalptaru Yog Vidyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          image: {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=85',
            path: 'hero/slide-2.jpg',
            alt: 'Meditation and pranayama practice',
          },
          order: 2,
          active: true,
        },
        {
          heading: 'Kalptaru Yog Vidyalaya',
          subheading: 'Traditional Yoga & Wellness',
          description:
            'Learn yoga the right way. We teach traditional practices combined with physiotherapy knowledge to help you stay healthy and active.',
          quote: 'Affiliated by Indian Yoga Association',
          ctaText: 'Explore Courses',
          ctaUrl: '/programs/courses',
          secondaryCtaText: 'Contact Us',
          secondaryCtaUrl: '/contact',
          image: {
            url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1920&q=85',
            path: 'hero/slide-3.jpg',
            alt: 'Ashram sanctuary courtyard',
          },
          order: 3,
          active: true,
        },
      ]);
      logger.info('✓ Hero slides seeded.');
    }

    // 4. Seed Courses
    const coursesCount = await Course.countDocuments();
    if (coursesCount === 0) {
      await Course.insertMany([
        {
          title: '200-Hour Classical Yoga Teacher Training (TTC)',
          slug: '200-hour-yoga-teacher-training',
          shortDescription:
            'A globally recognized foundation in authentic Hatha and Ashtanga Vinyasa, Yogic Philosophy, Patanjali Sutras, and Teaching Pedagogy.',
          description:
            'Our 200-Hour Yoga Teacher Training is a residential and intensive gateway to classical yoga. Designed according to the highest international standards of Yoga Alliance and the Ministry of AYUSH, this curriculum equips students with deep asana mechanics, anatomical safety, chanting, pranayama methodologies, and compassionate teaching leadership.',
          duration: '4 Weeks Full-Time',
          level: 'beginner',
          mode: 'residential',
          price: {
            amount: 48000,
            currency: 'INR',
            displayPrice: '₹48,000',
          },
          coverImage: {
            url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
            path: 'courses/ttc-200.jpg',
            alt: '200-Hour TTC Asana Lab',
          },
          features: [
            'Yoga Alliance RYT 200 Internationally Recognized Certificate',
            'Full Ashram Boarding, Sattvic Meals & Accommodations Included',
            'Daily Guru-Shishya Asana Lab & Alignment Adjustments',
            'Comprehensive Printed Textbooks & Sutra Commentaries',
          ],
          curriculum: [
            {
              moduleNumber: 1,
              title: 'Classical Asana Lab & Biomechanical Alignment',
              description: 'In-depth breakdown of foundational and intermediate postures.',
              topics: ['Standing Sequences & Pelvic Alignment', 'Inversions & Arm Balances', 'Therapeutic Variations & Contraindications'],
            },
            {
              moduleNumber: 2,
              title: 'Patanjali Yoga Sutras & Gita Darshana',
              description: 'Systematic study of Samadhi Pada and Sadhana Pada.',
              topics: ['The Eight Limbs (Ashtanga)', 'Kleshas & Mind Modification', 'Karma Yoga in Daily Life'],
            },
            {
              moduleNumber: 3,
              title: 'Anatomy, Physiology & Kinesiology of Sadhana',
              description: 'Bridging modern musculoskeletal anatomy with pranic nadis.',
              topics: ['Respiratory Mechanics & Diaphragm', 'Fascia & Joint Health', 'The Endocrine & Nervous Systems'],
            },
          ],
          instructor: {
            name: 'Acharya Ramanath Shastri',
            title: 'Lead Acharya (RYT 500)',
            founderRef: leadAcharya?._id,
          },
          certification: 'Yoga Alliance RYT 200 & AYUSH Certified',
          eligibility: 'Open to sincere seekers with at least 6 months of yoga practice.',
          schedule: 'Batches start every month: Oct, Nov & Dec 2026',
          status: 'published',
          featured: true,
          seo: {
            metaTitle: '200-Hour Yoga Teacher Training Course | Kalptaru Yog Vidyalaya',
            metaDescription: 'Join our internationally accredited 200-Hour Classical Yoga Teacher Training in Pune & Rishikesh.',
            keywords: ['yoga teacher training', '200 hour ttc', 'hatha yoga certification', 'ayush yoga'],
          },
        },
        {
          title: 'Foundational Hatha Yoga & Daily Discipline',
          slug: 'foundational-hatha-yoga-discipline',
          shortDescription:
            'Cultivate an unwavering daily morning practice with step-by-step posture sequencing, joint mobility, and introductory pranayama.',
          description:
            'A structured three-month morning immersive designed for seekers looking to establish an authentic personal sadhana. Focuses on traditional sukshma vyayama, joint cleansing, sun salutations with mantras, and progressive core stabilization.',
          duration: '3 Months (Morning Batches)',
          level: 'beginner',
          mode: 'hybrid',
          price: {
            amount: 14500,
            currency: 'INR',
            displayPrice: '₹14,500',
          },
          coverImage: {
            url: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?auto=format&fit=crop&w=800&q=80',
            path: 'courses/hatha-foundational.jpg',
            alt: 'Foundational Hatha Yoga Practice',
          },
          features: [
            '60 Scheduled Practice Sessions (Mon - Fri)',
            'Postural Correction Checklists & Personal Feedback',
            'Weekly Saturday Scriptural Q&A with Acharyas',
          ],
          curriculum: [
            {
              moduleNumber: 1,
              title: 'Sukshma Vyayama & Joint Freedom',
              topics: ['Anti-Rheumatic Series', 'Pawanmuktasana Sequence'],
            },
            {
              moduleNumber: 2,
              title: 'Surya Namaskar & Core Postures',
              topics: ['12 Mantra Salutations', 'Standing Stability & Hip Openers'],
            },
          ],
          instructor: {
            name: 'Yogini Devika Amma',
            title: 'Meditation & Sadhana Guide',
          },
          certification: 'Kalptaru Institute Sadhaka Diploma',
          status: 'published',
          featured: true,
        },
        {
          title: 'Advanced Pranayama & Meditative Mastery',
          slug: 'advanced-pranayama-meditative-mastery',
          shortDescription:
            'For established practitioners and yoga teachers seeking deep scriptural immersion into Hatha Yoga Pradipika and Kundalini science.',
          description:
            'An elevated six-week residential or online deep immersion into the esoteric pranic sciences. Explores advanced Kumbhaka (internal and external retention), the three Bandha energy locks, and classical Nadi Shuddhi protocols.',
          duration: '6 Weeks Intensive',
          level: 'advanced',
          mode: 'residential',
          price: {
            amount: 22000,
            currency: 'INR',
            displayPrice: '₹22,000',
          },
          coverImage: {
            url: 'https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80',
            path: 'courses/pranayama-mastery.jpg',
            alt: 'Advanced Pranayama Meditation',
          },
          features: [
            'Pranic Awakening Protocols from Hatha Pradipika',
            'Heart Rate Variability & Biofeedback Tracking',
            'Daily Mantra Japa & Silent Twilight Dhyana',
          ],
          curriculum: [
            {
              moduleNumber: 1,
              title: 'The Science of the Kumbhakas',
              topics: ['Sahaja vs Kevala Kumbhaka', 'Mula, Uddiyana, and Jalandhara Bandha'],
            },
            {
              moduleNumber: 2,
              title: 'Chakra Dhyana & Kundalini Awakening',
              topics: ['Shat-Chakra Bhedana', 'Spiritual sublimation of prana'],
            },
          ],
          instructor: {
            name: 'Acharya Ramanath Shastri',
            title: 'Lead Acharya (RYT 500)',
            founderRef: leadAcharya?._id,
          },
          certification: 'Advanced Acharya Endorsement',
          status: 'published',
          featured: true,
        },
      ]);
      logger.info('✓ Courses seeded.');
    }

    // 5. Seed Workshops
    const workshopsCount = await Workshop.countDocuments();
    if (workshopsCount === 0) {
      await Workshop.insertMany([
        {
          title: 'Pranayama & Kundalini Awakening Masterclass',
          slug: 'pranayama-kundalini-awakening',
          shortDescription:
            'An intensive practical exploration of ancient breathing methodologies, kumbhaka retention, and subtle nadi purification.',
          description:
            'A weekend residential intensive diving into the subtle anatomy of Ida, Pingala, and Sushumna nadis. Participants will learn precise breath counts, Bandha applications, and cleansing kriyas in a sacred ashram environment.',
          coverImage: {
            url: 'https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=800&q=80',
            path: 'workshops/pranayama-kundalini.jpg',
            alt: 'Pranayama workshop in sacred shala',
          },
          date: new Date('2026-10-18T09:00:00.000Z'),
          endDate: new Date('2026-10-20T17:00:00.000Z'),
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          duration: '3 Days Weekend',
          mode: 'in-person',
          location: {
            venue: 'Kalptaru Shala Sanctuary',
            address: '108 Sacred Grove Marg, Shanti Kunj',
            city: 'Pune',
          },
          capacity: {
            total: 35,
            booked: 18,
          },
          price: {
            amount: 5500,
            currency: 'INR',
            displayPrice: '₹5,500',
          },
          instructor: {
            name: 'Acharya Ramanath Shastri',
            title: 'Master Teacher',
            founderRef: leadAcharya?._id,
          },
          prerequisites: ['Basic familiarity with yoga breathing (Anulom Vilom) recommended.'],
          status: 'published',
          featured: true,
        },
        {
          title: 'Yoga Nidra & Deep Consciousness Immersion',
          slug: 'yoga-nidra-deep-consciousness',
          shortDescription:
            'Psychic sleep techniques designed to dissolve deep-seated samskaras, alleviate modern stress, and rejuvenate the nervous system.',
          description:
            'Experience the profound frontier between wakefulness and dreamless sleep. This 2-day retreat offers guided Sankalpa formation, 61-point body scan relaxation, and chakra visualization methods proven to reset autonomic balance.',
          coverImage: {
            url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
            path: 'workshops/yoga-nidra.jpg',
            alt: 'Yoga nidra relaxation practice',
          },
          date: new Date('2026-11-06T09:00:00.000Z'),
          endDate: new Date('2026-11-08T17:00:00.000Z'),
          startTime: '09:00 AM',
          endTime: '05:00 PM',
          duration: 'Weekend Sadhana',
          mode: 'residential',
          location: {
            venue: 'Ashram Dhyana Hall',
            city: 'Pune',
          },
          capacity: {
            total: 25,
            booked: 14,
          },
          price: {
            amount: 7200,
            currency: 'INR',
            displayPrice: '₹7,200',
          },
          instructor: {
            name: 'Yogini Devika Amma',
            title: 'Meditation Master',
          },
          status: 'published',
          featured: true,
        },
        {
          title: 'Shatkarma & Ayurvedic Kriya Detox Intensive',
          slug: 'shatkarma-ayurvedic-kriya-detox',
          shortDescription:
            'Classical yogic cleansing practices including Neti, Dhauti, Nauli, and Kapalabhati for internal biological purification.',
          description:
            'Cleanse the five elements within your physical vessel through classical Hatha kriyas. Under strict professional supervision, practice Jala Neti, Sutra Neti, Vamana Dhauti, and Agnisara for digestive and sinus purification.',
          coverImage: {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
            path: 'workshops/shatkarma-detox.jpg',
            alt: 'Shatkarma Ayurvedic Kriya',
          },
          date: new Date('2026-11-22T08:00:00.000Z'),
          startTime: '08:00 AM',
          endTime: '04:00 PM',
          duration: 'Full Day Intensive',
          mode: 'in-person',
          location: {
            venue: 'Kalptaru Ayurvedic Pavilion',
            city: 'Pune',
          },
          capacity: {
            total: 20,
            booked: 9,
          },
          price: {
            amount: 3500,
            currency: 'INR',
            displayPrice: '₹3,500',
          },
          instructor: {
            name: 'Dr. Govind Joshi (BAMS, RYT)',
            title: 'Ayurvedic Physician & Acharya',
          },
          status: 'published',
          featured: true,
        },
      ]);
      logger.info('✓ Workshops seeded.');
    }

    // 6. Seed Corporate Programs
    const corporateCount = await CorporateProgram.countDocuments();
    if (corporateCount === 0) {
      await CorporateProgram.insertMany([
        {
          title: 'Corporate Yogic Wellness & Ergonomic Balance',
          slug: 'corporate-yogic-wellness',
          tagline: 'Evidence-Based Mindfulness & Physical Poise for Executive Teams',
          shortDescription:
            'Evidence-based ergonomics, breathwork, and cognitive calm modules designed for high-stress executive teams.',
          description:
            'Modern knowledge workers face chronic postural fatigue, sympathetic overdrive, and cognitive fragmentation. Our corporate programs introduce practical, 15-minute desk protocols, postural alignment, and breath-directed stress modulation.',
          coverImage: {
            url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
            path: 'corporate/corporate-wellness.jpg',
            alt: 'Corporate yoga workshop',
          },
          format: 'on-site',
          duration: 'Custom Quarterly Engagements',
          targetAudience: 'Executive Leadership, IT Teams, Corporate Campuses',
          deliverables: [
            'On-site weekly shala sessions and ergonomic desk stretches',
            'Executive breathwork recordings for stress regulation',
            'Quarterly health and posture improvement metrics',
          ],
          modules: [
            {
              title: 'Cervical & Lumbar Spinal Health at Work',
              duration: '45 mins',
              description: 'Targeted stretches and core activations to reverse sitting fatigue.',
            },
            {
              title: 'Pranayama Protocols for Meeting Anxiety',
              duration: '30 mins',
              description: 'Quick breath regulations for immediate cognitive clarity.',
            },
          ],
          caseStudiesOrClients: ['Infosys Leadership Group', 'Tata Consultancy Services Pune', 'Symbiosis International'],
          pricingModel: 'custom-quote',
          order: 1,
          status: 'published',
          featured: true,
        },
      ]);
      logger.info('✓ Corporate programs seeded.');
    }

    // 7. Seed Membership Plans
    const membershipCount = await MembershipPlan.countDocuments();
    if (membershipCount === 0) {
      await MembershipPlan.insertMany([
        {
          title: 'Monthly Sadhana Pass',
          slug: 'monthly-sadhana-pass',
          billingCycle: 'monthly',
          price: {
            amount: 2500,
            currency: 'INR',
            originalAmount: 3000,
            discountPercentage: 16,
          },
          description:
            'Ideal for regular practitioners seeking consistency in traditional morning or evening batches with master instructors.',
          batches: [
            { name: 'Morning Shala Batch', timing: '06:00 AM – 07:30 AM', days: 'Mon to Fri' },
            { name: 'Evening Dhyana Batch', timing: '06:30 PM – 08:00 PM', days: 'Mon to Fri' },
          ],
          features: [
            'Unlimited weekday practice access',
            'Full access to the Kalptaru Yogic Library',
            'Monthly 1-on-1 alignment check-in with an Acharya',
            '10% discount on all intensive weekend workshops',
          ],
          popular: true,
          order: 1,
          status: 'published',
        },
        {
          title: 'Annual Shala Sadhaka Pass',
          slug: 'annual-shala-sadhaka-pass',
          billingCycle: 'annual',
          price: {
            amount: 24000,
            currency: 'INR',
            originalAmount: 30000,
            discountPercentage: 20,
          },
          description:
            'Our most committed pathway for devoted sadhakas seeking lifelong transformation and priority community privileges.',
          batches: [
            { name: 'All Morning & Evening Batches', timing: 'Flexible Attendance', days: 'Mon to Sat' },
          ],
          features: [
            'Unlimited year-round shala access',
            'Complimentary entry to 2 Weekend Intensives of your choice',
            'Priority reservations for international retreats',
            'Personalized sadhana journal and consultation quarterly',
          ],
          popular: false,
          order: 2,
          status: 'published',
        },
      ]);
      logger.info('✓ Membership plans seeded.');
    }

    // 8. Seed Gallery Categories & Images
    const categoriesCount = await GalleryCategory.countDocuments();
    let catDaily, catTtc, catAshram;
    if (categoriesCount === 0) {
      catDaily = await GalleryCategory.create({
        name: 'Daily Practice',
        slug: 'daily-practice',
        description: 'Morning and evening shala sadhana in session',
        order: 1,
        isActive: true,
      });
      catTtc = await GalleryCategory.create({
        name: 'Teacher Training',
        slug: 'teacher-training',
        description: '200h & 500h Teacher Training labs and certification ceremonies',
        order: 2,
        isActive: true,
      });
      catAshram = await GalleryCategory.create({
        name: 'Ashram Life',
        slug: 'ashram-life',
        description: 'Tranquil grounds, Vedic chanting, and community gatherings',
        order: 3,
        isActive: true,
      });
      logger.info('✓ Gallery categories seeded.');
    } else {
      catDaily = await GalleryCategory.findOne({ slug: 'daily-practice' });
      catTtc = await GalleryCategory.findOne({ slug: 'teacher-training' });
      catAshram = await GalleryCategory.findOne({ slug: 'ashram-life' });
    }

    const galleryCount = await GalleryImage.countDocuments();
    if (galleryCount === 0) {
      await GalleryImage.insertMany([
        {
          title: 'Dawn Surya Namaskar on the Pavilions',
          description: 'Students greet the rising sun with synchronized Sun Salutations in open-air courtyards.',
          image: {
            url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=85',
            path: 'gallery/surya-namaskar.jpg',
            alt: 'Dawn Surya Namaskar',
          },
          category: catDaily?._id,
          categorySlug: 'daily-practice',
          event: 'International Day of Yoga Celebration',
          featured: true,
          order: 1,
          status: 'published',
        },
        {
          title: 'Traditional Guru-Shishya Asana Lab',
          description: 'Acharyas guide precise skeletal adjustments and breath awareness in our sacred shala.',
          image: {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
            path: 'gallery/asana-lab.jpg',
            alt: 'Guru-Shishya Asana Lab',
          },
          category: catTtc?._id,
          categorySlug: 'teacher-training',
          event: '200-Hour TTC Autumn Cohort',
          featured: true,
          order: 2,
          status: 'published',
        },
        {
          title: 'Evening Chanting & Silent Dhyana',
          description: 'The twilight bell calls sadhakas together for meditative stillness and Vedic chanting.',
          image: {
            url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
            path: 'gallery/evening-chanting.jpg',
            alt: 'Evening Chanting & Silent Dhyana',
          },
          category: catAshram?._id,
          categorySlug: 'ashram-life',
          event: 'Navratri Sadhana Immersion',
          featured: true,
          order: 3,
          status: 'published',
        },
      ]);
      logger.info('✓ Gallery images seeded.');
    }

    // 9. Seed Videos
    const videosCount = await Video.countDocuments();
    if (videosCount === 0) {
      await Video.insertMany([
        {
          title: 'The Essence of Classical Yoga: Beyond Asana Physicality',
          description:
            'A discourse on Patanjali Yoga Sutra philosophy, clarifying the true purpose of asana as preparation for quiet mind and dhyana.',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          youtubeVideoId: 'dQw4w9WgXcQ',
          category: 'Philosophy Discourse',
          speaker: 'Acharya Ramanath Shastri',
          duration: '28:45',
          thumbnail: {
            url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85',
            path: 'videos/thumb-1.jpg',
            alt: 'The Essence of Classical Yoga',
          },
          featured: true,
          order: 1,
          status: 'published',
        },
        {
          title: 'Nadi Shodhana Pranayama: The Science of Alternate Nostril Breathing',
          description:
            'Step-by-step masterclass demonstrating proper hand mudras, breath ratio cycles, and psychological benefits of Nadi Shodhana.',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          youtubeVideoId: 'dQw4w9WgXcQ',
          category: 'Guided Practice',
          speaker: 'Yogini Devika Amma',
          duration: '16:20',
          thumbnail: {
            url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
            path: 'videos/thumb-2.jpg',
            alt: 'Nadi Shodhana Pranayama',
          },
          featured: true,
          order: 2,
          status: 'published',
        },
        {
          title: 'Life in the Ashram: What to Expect in 200-Hour TTC',
          description:
            'A visual tour of Kalptaru Vidyalaya, student daily routines, sattvic meals, and gurukula atmosphere.',
          youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          youtubeVideoId: 'dQw4w9WgXcQ',
          category: 'Campus Overview',
          speaker: 'Kalptaru Institute Faculty',
          duration: '12:10',
          thumbnail: {
            url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
            path: 'videos/thumb-3.jpg',
            alt: 'Life in the Ashram',
          },
          featured: true,
          order: 3,
          status: 'published',
        },
      ]);
      logger.info('✓ Videos seeded.');
    }

    // 10. Seed Benefits
    const benefitsCount = await Benefit.countDocuments();
    if (benefitsCount === 0) {
      await Benefit.insertMany([
        {
          title: 'Physical Wellness',
          sanskritTerm: 'Sharira Shuddhi',
          description:
            'Restores homeostasis across cardiovascular, endocrine, and metabolic functions through therapeutic biomechanics.',
          scriptureRef: 'Hatha Yoga Pradipika (1.17)',
          category: 'physical',
          order: 1,
          status: 'published',
        },
        {
          title: 'Mental Clarity',
          sanskritTerm: 'Manas Shanti',
          description:
            'Quiets sensory distraction and mental agitations, fostering sustained concentration, cognitive poise, and insight.',
          scriptureRef: 'Yoga Sutra (1.33)',
          category: 'mental',
          order: 2,
          status: 'published',
        },
        {
          title: 'Better Flexibility',
          sanskritTerm: 'Anga Laghavam',
          description:
            'Elongates muscle fibers, lubricates synovial joints, and corrects postural deviations without strain or hypermobility.',
          scriptureRef: 'Gheranda Samhita (2.1)',
          category: 'physical',
          order: 3,
          status: 'published',
        },
        {
          title: 'Stress Management',
          sanskritTerm: 'Prana Samyama',
          description:
            'Down-regulates the sympathetic nervous system, lowers cortisol, and triggers restorative parasympathetic deep healing.',
          scriptureRef: 'Bhagavad Gita (6.17)',
          category: 'mental',
          order: 4,
          status: 'published',
        },
        {
          title: 'Mindful Living',
          sanskritTerm: 'Smriti & Viveka',
          description:
            'Integrates conscious awareness into food, speech, relationships, and everyday actions beyond the yoga mat.',
          scriptureRef: 'Yoga Sutra (2.26)',
          category: 'spiritual',
          order: 5,
          status: 'published',
        },
        {
          title: 'Improved Strength',
          sanskritTerm: 'Dridhata & Balam',
          description:
            'Builds functional isometric core integrity, skeletal stability, and unyielding psychological resilience.',
          scriptureRef: 'Gheranda Samhita (1.11)',
          category: 'physical',
          order: 6,
          status: 'published',
        },
      ]);
      logger.info('✓ Benefits seeded.');
    }

    // 11. Seed Programs (Polymorphic catalog entries)
    const programsCount = await Program.countDocuments();
    if (programsCount === 0) {
      await Program.insertMany([
        {
          title: 'Teacher Training & Comprehensive Courses',
          slug: 'courses-catalog',
          programType: 'course',
          tagline: 'Teacher Certifications & Academic Curriculums',
          shortDescription:
            'Internationally recognized 200-Hour and 500-Hour Yoga Teacher Training Certifications, Classical Hatha Immersion, and Patanjali Yoga Sutra philosophy.',
          description:
            'Our certification pathway empowers practitioners to step into professional yoga stewardship with authenticity, anatomical mastery, and spiritual dignity.',
          badge: 'Certification',
          highlights: ['200-Hour TTC', '500-Hour Mastery', 'Ayush / Alliance Approved'],
          order: 1,
          status: 'published',
          featured: true,
        },
        {
          title: 'Workshops & Masterclasses',
          slug: 'workshops-catalog',
          programType: 'workshop',
          tagline: 'Focused Intensives & Deep Dives',
          shortDescription:
            'Focused weekend deep-dives on Pranayama, Kundalini Kriyas, Shatkarma cleansing, and Bandha locks.',
          description:
            'Short-format retreats and immersives designed for busy sadhakas seeking rapid skill refinement and biological detox.',
          badge: 'Intensives',
          highlights: ['3-Day Intensive Weekend Modules', 'Personalized Acharya Guidance', 'Residential Ashram Sanctuary'],
          order: 2,
          status: 'published',
          featured: true,
        },
        {
          title: 'Corporate Yogic Wellness',
          slug: 'corporate-catalog',
          programType: 'corporate',
          tagline: 'Enterprise Balance & Executive Health',
          shortDescription:
            'Evidence-based ergonomics, breathwork, and cognitive calm modules designed for high-stress executive teams.',
          description:
            'Custom enterprise engagements and desk-stretch protocols transforming workplace resilience.',
          badge: 'Executive',
          highlights: ['On-site Corporate Retreats', 'Desk-Stretch Protocols', 'Leadership Mindfulness Intensives'],
          order: 3,
          status: 'published',
          featured: true,
        },
        {
          title: 'Institute Practice Membership',
          slug: 'membership-catalog',
          programType: 'membership',
          tagline: 'Daily Shala Sadhana Passes',
          shortDescription:
            'Make the sacred practice hall an integral part of your daily life with morning and evening batches.',
          description:
            'Unlimited morning and evening practice, scriptural library access, and priority event invitations.',
          badge: 'Daily Sadhana',
          highlights: ['Morning Shala Batches (06:00 AM)', 'Evening Dhyana Batches (06:30 PM)', 'Monthly & Annual Passes'],
          order: 4,
          status: 'published',
          featured: true,
        },
      ]);
      logger.info('✓ Programs seeded.');
    }

    // 12. Seed Default Super Admin and Student
    const existingAdmin = await User.findOne({ email: 'admin@kalptaruyog.org' });
    if (!existingAdmin) {
      await User.create({
        name: 'Kalptaru Admin Acharya',
        email: 'admin@kalptaruyog.org',
        phone: '+91 98765 00001',
        password: 'Admin@Kalptaru2026!',
        role: 'super_admin',
        isActive: true,
        isEmailVerified: true,
      });
      logger.info('✓ Super admin account seeded: admin@kalptaruyog.org');
    }

    const existingStudent = await User.findOne({ email: 'student@kalptaruyog.org' });
    if (!existingStudent) {
      await User.create({
        name: 'Aarav Sharma',
        email: 'student@kalptaruyog.org',
        phone: '+91 98765 00002',
        password: 'Student@Kalptaru2026!',
        role: 'student',
        isActive: true,
        isEmailVerified: true,
      });
      logger.info('✓ Sample student account seeded: student@kalptaruyog.org');
    }

    logger.info('All content architecture data seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    logger.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
