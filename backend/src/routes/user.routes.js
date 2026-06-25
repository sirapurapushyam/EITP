import { Router } from 'express';
import * as controller from '../controllers/user.controller.js';
import {
  requireAuth,
  authorizeRoles
} from '../middleware/auth.middleware.js';
import { ROLES } from '../constants/roles.js';
import { upload } from '../config/multer.js';
import * as uploadController from '../controllers/upload.controller.js';
const router = Router();

router.use(requireAuth);

// own profile
router.get('/me', controller.getMyProfile);
router.patch('/me', controller.updateMyProfile);
router.patch(
  '/profile-image',
  upload.single('profileImage'),
  uploadController.uploadProfileImage
);

router.patch(
  '/resume',
  upload.single('resume'),
  uploadController.uploadResume
);
// dean + coordinator
router.get(
  '/',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.listUsers
);
router.get(
  "/search",
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.searchStudent
);
// all authenticated users
router.get(
  "/chat-users",
  requireAuth,
  controller.getChatUsers
);
router.get('/:id', controller.getUser);

// dean only
router.patch(
  '/:id/approve-coordinator',
  authorizeRoles(ROLES.DEAN_EITP),
  controller.approveCoordinator
);

// dean + coordinator
router.patch(
  '/:id/promote-intern',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.promoteToIntern
);

router.patch(
  '/:id/remove-intern',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.removeInternRole
);

router.get(
  '/students',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.listStudents
);

router.get(
  '/interns',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.listInterns
);

router.get(
  '/coordinators',
  authorizeRoles(ROLES.DEAN_EITP),
  controller.listCoordinators
);

router.get(
  '/stats',
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.getUserStats
);
router.delete(
  "/:id",
  requireAuth,
  authorizeRoles(
    ROLES.DEAN_EITP,
    ROLES.CAMPUS_COORDINATOR
  ),
  controller.deleteUser
);


export default router;