import { Router } from 'express';
import {
  confirmRegister,
  getProfile,
  login,
  logout,
  requestRegisterCode,
  saveProfile,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register/request-code', requestRegisterCode);
router.post('/register/confirm', confirmRegister);
router.post('/login', login);
router.post('/logout', requireAuth, logout);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, saveProfile);

export default router;
