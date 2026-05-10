import { Router } from 'express';
import { create, getAll, addMember } from './project.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT); // All project routes are protected

router.post('/', create);
router.get('/', getAll);
router.post('/:id/members', addMember);

export default router;
