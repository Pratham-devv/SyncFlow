import { Router } from 'express';
import { getAll } from './activity.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.get('/:projectId', getAll);

export default router;
