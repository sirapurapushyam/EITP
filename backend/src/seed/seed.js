// import { connectDB } from '../config/db.js';
// import { Campus } from '../models/campus.model.js';
// import { User } from '../models/user.model.js';
// import { ROLES } from '../constants/roles.js';

// async function runSeed() {
//   await connectDB();

//   await Promise.all([
//     User.deleteMany({}),
//     Campus.deleteMany({})
//   ]);

//   const campuses = await Campus.insertMany([
//     { campusName: 'RGUKT Srikakulam' },
//     { campusName: 'RGUKT Ongole' },
//     { campusName: 'RGUKT Nuzvidu' },
//     { campusName: 'RGUKT RK Valley' }
//   ]);

//   const dean = await User.create({
//     name: 'Dean EITP',
//     email: 'dean@eitp.edu',
//     collegeEmail: 'dean@eitp.edu',
//     password: 'Password@123',
//     role: ROLES.DEAN_EITP,
//     approved: true
//   });

//   const coordinatorUsers = await User.create([
//     {
//       name: 'Coordinator 1',
//       email: 'coord1@eitp.edu',
//       collegeEmail: 'coord1@eitp.edu',
//       password: 'Password@123',
//       role: ROLES.CAMPUS_COORDINATOR,
//       campus: campuses[0]._id,
//       approved: true
//     },
//     {
//       name: 'Coordinator 2',
//       email: 'coord2@eitp.edu',
//       collegeEmail: 'coord2@eitp.edu',
//       password: 'Password@123',
//       role: ROLES.CAMPUS_COORDINATOR,
//       campus: campuses[1]._id,
//       approved: true
//     },
//     {
//       name: 'Coordinator 3',
//       email: 'coord3@eitp.edu',
//       collegeEmail: 'coord3@eitp.edu',
//       password: 'Password@123',
//       role: ROLES.CAMPUS_COORDINATOR,
//       campus: campuses[2]._id,
//       approved: true
//     },
//     {
//       name: 'Coordinator 4',
//       email: 'coord4@eitp.edu',
//       collegeEmail: 'coord4@eitp.edu',
//       password: 'Password@123',
//       role: ROLES.CAMPUS_COORDINATOR,
//       campus: campuses[3]._id,
//       approved: true
//     }
//   ]);

//   await Campus.bulkWrite(
//     campuses.map((campus, index) => ({
//       updateOne: {
//         filter: { _id: campus._id },
//         update: { coordinator: coordinatorUsers[index]._id }
//       }
//     }))
//   );

//   const interns = [];
//   for (let index = 1; index <= 20; index += 1) {
//     interns.push({
//       name: `Intern Candidate ${index}`,
//       email: `intern${index}@eitp.edu`,
//       collegeEmail: `intern${index}@eitp.edu`,
//       password: 'Password@123',
//       studentId: `EITPI${String(index).padStart(4, '0')}`,
//       campus: campuses[index % campuses.length]._id,
//       department: 'Computer Science',
//       year: '4',
//       skills: ['Teamwork', 'Communication'],
//       role: ROLES.STUDENT,
//       approved: true
//     });
//   }

//   const students = [];
//   for (let index = 1; index <= 200; index += 1) {
//     students.push({
//       name: `Student ${index}`,
//       email: `student${index}@eitp.edu`,
//       collegeEmail: `student${index}@eitp.edu`,
//       password: 'Password@123',
//       studentId: `EITP${String(index).padStart(4, '0')}`,
//       campus: campuses[index % campuses.length]._id,
//       department: 'Computer Science',
//       year: String((index % 4) + 1),
//       skills: ['Leadership', 'Communication'],
//       role: ROLES.STUDENT,
//       approved: true
//     });
//   }

//   await User.create([...interns, ...students]);

//   console.log({
//     message: 'Seed data created',
//     dean: dean.email,
//     campuses: campuses.length,
//     coordinators: coordinatorUsers.length,
//     internCandidates: interns.length,
//     students: students.length
//   });

//   process.exit(0);
// }

// runSeed().catch((error) => {
//   console.error(error);
//   process.exit(1);
// });
import mongoose from 'mongoose';
import { env } from '../config/env.js';

import { seedCampuses } from './seedCampuses.js';
import { seedDean } from './seedDean.js';
import { seedCoordinators } from './seedCoordinators.js';
import { seedInterns } from './seedInterns.js';
import { seedStudents } from './seedStudents.js';

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);

    await seedCampuses();
    await seedDean();
    await seedCoordinators();
    await seedInterns();
    await seedStudents();

    console.log('Database seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seed();