import { Router } from 'express';
import { signup, login, getMe } from './auth.controller.js';
import { verifyJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', verifyJWT, getMe);

export default router;
