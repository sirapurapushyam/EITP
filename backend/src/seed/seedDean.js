import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export async function seedDean() {
  const exists = await User.findOne({
    role: ROLES.DEAN_EITP
  });

  if (exists) return;

  await User.create({
    name: 'Dean EITP',
    personalEmail: 'dean@eitp.com',
    phone: '9876543210',
    designation: 'Dean EITP',
    campus: 'RGUKT Nuzvid',
    password: 'Dean@12345',
    role: ROLES.DEAN_EITP,
    approved: true
  });

  console.log('Dean seeded');
}