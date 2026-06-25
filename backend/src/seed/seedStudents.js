import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export async function seedStudents() {

  const branches = [
    'CSE',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'CHEMICAL',
    'MME'
  ];

  const years = ['E1', 'E2', 'E3', 'E4'];

  const campuses = [
    'RGUKT Srikakulam',
    'RGUKT Nuzvid',
    'RGUKT Ongole',
    'RGUKT RK Valley'
  ];

  for (let i = 1; i <= 200; i++) {

    const campus = campuses[(i - 1) % 4];
    const branch = branches[i % branches.length];
    const yearOfStudy = years[i % years.length];

    const studentId = `N${String(i).padStart(6, '0')}`;

    const exists = await User.findOne({
      studentId
    });

    if (exists) continue;

    await User.create({
      name: `Student ${i}`,
      studentId,
      collegeEmail: `${studentId.toLowerCase()}@rgukt.ac.in`,
      personalEmail: `student${i}@gmail.com`,
      phone: `9${String(100000000 + i)}`,
      branch,
      yearOfStudy,
      batchYear: 2022,
      passedOutYear: 2028,
      campus,
      skills: ['Java', 'React'],
      linkedinProfile: '',
      githubProfile: '',
      password: 'Student@123',
      role: ROLES.STUDENT,
      approved: true
    });

  }

  console.log('200 Students Seeded');
}