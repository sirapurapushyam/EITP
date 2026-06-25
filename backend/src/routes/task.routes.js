import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/task.controller.js';
import { requireAuth, authorizeRoles } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();
const taskSchema = z.object({
	title: z.string().min(2),
	description: z.string().min(5),
	assignedTo: z.string().min(1),
	priority: z.string().optional().default('Medium'),
	deadline: z.string().min(1),
	progress: z.number().optional().default(0)
});

router.get('/', requireAuth, controller.listTasks);
router.post('/', requireAuth, authorizeRoles(ROLES.DEAN_EITP, ROLES.CAMPUS_COORDINATOR), validate(taskSchema), controller.createTask);
router.patch('/:id', requireAuth, authorizeRoles(ROLES.DEAN_EITP, ROLES.CAMPUS_COORDINATOR), controller.updateTask);
router.post('/:id/submit', requireAuth, authorizeRoles(ROLES.STUDENT_INTERN), controller.submitTask);

export default router;
