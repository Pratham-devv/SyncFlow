import { Router } from 'express';
import { create, getAll, update, remove, changeStatus } from './task.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyJWT);

router.post('/', create);
router.get('/:projectId', getAll);
router.put('/:id', update);
router.delete('/:id', remove);
router.patch('/:id/status', changeStatus);

export default router;
