import { Router } from 'express';
import { register, login, me, updateMe, deleteMe } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);

export default router;

