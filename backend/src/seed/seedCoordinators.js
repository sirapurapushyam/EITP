import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export async function seedCoordinators() {

  const coordinators = [
    {
      name: 'Coordinator Srikakulam',
      personalEmail: 'coordinator.sklm@eitp.com',
      phone: '9000000001',
      designation: 'English Lecturer',
      campus: 'RGUKT Srikakulam',
      password: 'Coordinator@123',
      role: ROLES.CAMPUS_COORDINATOR,
      approved: true
    },
    {
      name: 'Coordinator Nuzvid',
      personalEmail: 'coordinator.nuzvid@eitp.com',
      phone: '9000000002',
      designation: 'Mathematics Lecturer',
      campus: 'RGUKT Nuzvid',
      password: 'Coordinator@123',
      role: ROLES.CAMPUS_COORDINATOR,
      approved: true
    },
    {
      name: 'Coordinator Ongole',
      personalEmail: 'coordinator.ongole@eitp.com',
      phone: '9000000003',
      designation: 'Physics Lecturer',
      campus: 'RGUKT Ongole',
      password: 'Coordinator@123',
      role: ROLES.CAMPUS_COORDINATOR,
      approved: true
    },
    {
      name: 'Coordinator RK Valley',
      personalEmail: 'coordinator.rkv@eitp.com',
      phone: '9000000004',
      designation: 'Chemistry Lecturer',
      campus: 'RGUKT RK Valley',
      password: 'Coordinator@123',
      role: ROLES.CAMPUS_COORDINATOR,
      approved: true
    }
  ];

  for (const coordinator of coordinators) {

    const exists = await User.findOne({
      personalEmail: coordinator.personalEmail
    });

    if (!exists) {
      await User.create(coordinator);
    }
  }

  console.log('Coordinators seeded');
}