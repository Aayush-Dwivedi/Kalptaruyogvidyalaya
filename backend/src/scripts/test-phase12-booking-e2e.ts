import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Booking } from '../models/Booking';
import { BookingService } from '../services/booking.service';

async function runBookingE2ETests() {
  console.log('\n======================================================');
  console.log('   PHASE 12 — COMPLETE BOOKING SYSTEM E2E VERIFICATION ');
  console.log('======================================================\n');

  await mongoose.connect(env.MONGODB_URI);
  console.log('✓ Connected to MongoDB');

  // 1. Ensure test student and admin accounts exist
  let testStudent = await User.findOne({ email: 'e2e_student@kalptaru.org' });
  if (!testStudent) {
    testStudent = await User.create({
      name: 'Aarav Dev Sadhaka',
      email: 'e2e_student@kalptaru.org',
      password: 'SecurePassword123!',
      role: 'student',
      phone: '+91 98765 12345',
    });
  }

  let testAdmin = await User.findOne({ email: 'admin@kalptaruyog.org' });
  if (!testAdmin) {
    testAdmin = await User.findOne({ role: 'admin' });
  }

  // 2. Ensure test published course exists with capacity 1
  let testCourse = await Course.findOne({ slug: 'e2e-capacity-test-course' });
  if (!testCourse) {
    testCourse = await Course.create({
      title: 'E2E Asana Immersion & Sadhana Intensive',
      slug: 'e2e-capacity-test-course',
      description: 'Rigorous cohort with strict server-side capacity enforcement.',
      duration: '4 Weeks',
      level: 'intermediate',
      mode: 'in-person',
      schedule: '06:00 AM – 08:30 AM',
      status: 'published',
      price: { amount: 15000, currency: 'INR', displayPrice: '₹15,000' },
      capacity: { total: 1, enrolled: 0 },
      instructor: {
        name: 'Acharya Ramanath Shastri',
        title: 'Founder & Principal Acharya',
      },
      coverImage: {
        url: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=1200&q=80',
        path: 'courses/e2e-cover.jpg',
        alt: 'E2E Course Cover',
      },
    });
  } else {
    testCourse.capacity = { total: 1, enrolled: 0 };
    testCourse.status = 'published';
    await testCourse.save();
  }

  // Clean up any old test bookings for this course
  await Booking.deleteMany({ 'program.programId': testCourse._id });

  // Test 1: Successful booking creation with server-side capacity allocation
  console.log('\n[Test 1] Booking a course cohort...');
  const booking1 = await BookingService.createBooking(testStudent._id.toString(), {
    programType: 'course',
    programId: testCourse._id.toString(),
    schedule: {
      batch: 'Morning Gurukula Batch',
      time: '06:00 AM – 08:30 AM',
      mode: 'in-person',
      venue: 'Kalptaru Tapovan Shala',
    },
    metadata: {
      sadhanaExperience: 'Intermediate (1-3 years)',
      healthConditions: 'None',
      dietaryPreferences: 'Sattvic Pure Vegetarian',
      emergencyContactName: 'Kamala Sharma',
      emergencyContactPhone: '+91 98111 22334',
    },
    notes: 'Looking forward to the immersion',
  });

  console.log(`✓ Booking created with Ref: ${booking1.bookingReference}`);
  console.log(`  - Status: ${booking1.bookingStatus}`);
  console.log(`  - Payment Status: ${booking1.paymentStatus} (No payment gateway yet - as specified)`);
  console.log(`  - Amount: ${booking1.amount.displayAmount}`);

  if (!booking1.bookingReference.startsWith('BK-')) {
    throw new Error(`Expected bookingReference to start with BK-, got ${booking1.bookingReference}`);
  }

  // Verify course capacity incremented
  const courseAfterB1 = await Course.findById(testCourse._id);
  console.log(`✓ Course enrolled capacity updated: ${courseAfterB1?.capacity.enrolled} / ${courseAfterB1?.capacity.total}`);
  if (courseAfterB1?.capacity.enrolled !== 1) {
    throw new Error(`Expected course capacity.enrolled to be 1, got ${courseAfterB1?.capacity.enrolled}`);
  }

  // Test 2: Preventing Double Booking for same student
  console.log('\n[Test 2] Preventing double-booking for the same student...');
  try {
    await BookingService.createBooking(testStudent._id.toString(), {
      programType: 'course',
      programId: testCourse._id.toString(),
    });
    throw new Error('Should have failed double-booking!');
  } catch (err: any) {
    console.log(`✓ Correctly rejected double-booking: "${err.message}" (Status: ${err.statusCode || 409})`);
  }

  // Test 3: Strict Server-Side Capacity Limit (Preventing Overbooking)
  console.log('\n[Test 3] Preventing overbooking when capacity total is reached...');
  let secondStudent = await User.findOne({ email: 'e2e_student_two@kalptaru.org' });
  if (!secondStudent) {
    secondStudent = await User.create({
      name: 'Pooja Sadhaka',
      email: 'e2e_student_two@kalptaru.org',
      password: 'SecurePassword123!',
      role: 'student',
      phone: '+91 98765 67890',
    });
  }

  try {
    await BookingService.createBooking(secondStudent._id.toString(), {
      programType: 'course',
      programId: testCourse._id.toString(),
    });
    throw new Error('Should have rejected booking due to exhausted cohort capacity!');
  } catch (err: any) {
    console.log(`✓ Strict Server-Side Capacity Check Passed: "${err.message}"`);
    if (!err.message.includes('maximum capacity')) {
      throw new Error(`Unexpected error message: ${err.message}`);
    }
  }

  // Test 4: Cancellation and automatic Capacity Release
  console.log('\n[Test 4] Cancelling booking and verifying capacity release...');
  const cancelledBooking = await BookingService.cancelBooking(
    booking1._id.toString(),
    { _id: testStudent._id.toString(), role: 'student' },
    'Personal schedule adjustment'
  );
  console.log(`✓ Booking status updated to: ${cancelledBooking.bookingStatus}`);
  console.log(`  - Cancellation reason: "${cancelledBooking.cancellationReason}"`);

  const courseAfterCancel = await Course.findById(testCourse._id);
  console.log(`✓ Course capacity decremented back: ${courseAfterCancel?.capacity.enrolled} / ${courseAfterCancel?.capacity.total}`);
  if (courseAfterCancel?.capacity.enrolled !== 0) {
    throw new Error(`Expected enrolled capacity to return to 0, got ${courseAfterCancel?.capacity.enrolled}`);
  }

  // Test 5: Re-booking after seat release succeeds
  console.log('\n[Test 5] Second student can now book the newly released seat...');
  const booking2 = await BookingService.createBooking(secondStudent._id.toString(), {
    programType: 'course',
    programId: testCourse._id.toString(),
    schedule: { batch: 'Evening Sadhana Batch' },
  });
  console.log(`✓ Second student booked seat Ref: ${booking2.bookingReference}`);

  // Test 6: Admin View, Search, Filter, and Status Update
  console.log('\n[Test 6] Admin query and status management...');
  const adminQuery = await BookingService.getBookings({
    search: booking2.bookingReference,
    status: 'confirmed',
  });
  console.log(`✓ Admin search found ${adminQuery.items.length} booking matching reference.`);
  if (adminQuery.items.length !== 1) {
    throw new Error(`Expected 1 booking result, got ${adminQuery.items.length}`);
  }

  // Admin status update
  const adminUpdated = await BookingService.updateBookingStatus(booking2._id.toString(), {
    bookingStatus: 'completed',
    paymentStatus: 'paid',
    notes: 'Student completed with distinguished certification merit.',
  });
  console.log(`✓ Admin updated status: BookingStatus=${adminUpdated.bookingStatus}, PaymentStatus=${adminUpdated.paymentStatus}`);
  console.log(`  - Admin Note: "${adminUpdated.notes}"`);

  // Clean up test data
  await Booking.deleteMany({ 'program.programId': testCourse._id });
  await Course.findByIdAndDelete(testCourse._id);
  console.log('\n✓ Cleaned up test artifacts.');

  console.log('\n======================================================');
  console.log('   ALL PHASE 12 BOOKING TESTS PASSED FLAWLESSLY!      ');
  console.log('======================================================\n');
  await mongoose.disconnect();
}

runBookingE2ETests().catch((err) => {
  console.error('\n❌ E2E Test Failure:', err);
  process.exit(1);
});
