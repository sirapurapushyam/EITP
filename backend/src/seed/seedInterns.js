import { User } from '../models/user.model.js';
import { ROLES } from '../constants/roles.js';

export async function seedInterns() {

  const branches = [
    'CSE',
    'ECE',
    'EEE',
    'MECH',
    'CIVIL',
    'CHEMICAL',
    'MME'
  ];

  const years = ['E2', 'E3', 'E4'];

  const campuses = [
     'RGUKT Srikakulam',
  'RGUKT Nuzvid',
  'RGUKT Ongole',
  'RGUKT RK Valley'
  ];

  for (let i = 1; i <= 20; i++) {

    const campus = campuses[(i - 1) % 4];
    const branch = branches[i % branches.length];
    const yearOfStudy = years[i % years.length];

    const studentId = `I${String(i).padStart(6, '0')}`;

    const exists = await User.findOne({
      studentId
    });

    if (exists) continue;

    await User.create({
      name: `Intern ${i}`,
      studentId,
      collegeEmail: `${studentId.toLowerCase()}@rgukt.ac.in`,
      personalEmail: `intern${i}@gmail.com`,
      phone: `8${String(100000000 + i)}`,
      branch,
      yearOfStudy,
      batchYear: 2021,
      passedOutYear: 2027,
      campus,
      skills: ['NodeJS', 'React'],
      linkedinProfile: '',
      githubProfile: '',
      password: 'Intern@123',
      role: ROLES.STUDENT_INTERN,
      approved: true
    });

  }

  console.log('20 Interns Seeded');
}