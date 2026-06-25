import { Campus } from '../models/campus.model.js';
import { CAMPUSES } from '../constants/campus.constants.js';

export async function seedCampuses() {
  for (const campusName of CAMPUSES) {
    const exists = await Campus.findOne({ campusName });

    if (!exists) {
      await Campus.create({
        campusName
      });
    }
  }

  console.log('Campuses seeded');
}