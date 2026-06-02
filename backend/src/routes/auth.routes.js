import { Router } from 'express';
import {
  confirmEmailChange,
  confirmPasswordReset,
  confirmRegister,
  getProfile,
  login,
  logout,
  requestEmailChangeCode,
  requestPasswordResetCode,
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
router.post('/password/request-code', requestPasswordResetCode);
router.post('/password/confirm', confirmPasswordReset);
router.post('/email/request-code', requireAuth, requestEmailChangeCode);
router.post('/email/confirm', requireAuth, confirmEmailChange);

export default router;
