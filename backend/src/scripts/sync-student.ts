import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function syncStudentUser() {
  await connectDB();
  const hashedPassword = await bcrypt.hash('Student@Kalptaru2026!', 12);
  
  const student = await User.findOneAndUpdate(
    { email: 'student@kalptaruyog.org' },
    {
      name: 'Aarav Sharma',
      email: 'student@kalptaruyog.org',
      phone: '+91 98765 00002',
      password: hashedPassword,
      role: 'student',
      isActive: true,
      isEmailVerified: true,
    },
    { upsert: true, new: true }
  );

  console.log('✓ Student account synced:', student.email, 'ID:', student._id);
  await disconnectDB();
}

syncStudentUser().catch(console.error);
