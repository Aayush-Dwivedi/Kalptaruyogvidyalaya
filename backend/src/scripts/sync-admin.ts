import { connectDB, disconnectDB } from '../config/database';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

async function syncAdminUser() {
  await connectDB();
  const hashedPassword = await bcrypt.hash('Admin@Kalptaru2026!', 12);

  const admin = await User.findOneAndUpdate(
    { email: 'admin@kalptaruyog.org' },
    {
      name: 'Acharya Ramanath Shastri',
      email: 'admin@kalptaruyog.org',
      phone: '+91 98765 00001',
      password: hashedPassword,
      role: 'super_admin',
      isActive: true,
      isEmailVerified: true,
    },
    { upsert: true, new: true }
  );

  console.log('✓ Admin account synced:', admin.email, 'Role:', admin.role, 'ID:', admin._id);
  await disconnectDB();
}

syncAdminUser().catch(console.error);
