import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { listChats, createChat, getChat, sendMessage, deleteChat, getMeta, updateChat } from '../controllers/chatController';

const router = Router();

router.use(authMiddleware);

router.get('/meta', getMeta);
router.get('/', listChats);
router.post('/', createChat);
router.get('/:id', getChat);
router.put('/:id', updateChat);
router.post('/:id/messages', sendMessage);
router.delete('/:id', deleteChat);

export default router;
