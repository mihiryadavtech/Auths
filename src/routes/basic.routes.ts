import { Router } from 'express';
import {
  basicLogin,
  basicSignUp,
  updateUser,
} from '../controllers/basic.controller';

import { auth } from '../middleware/basicAuth';
const router = Router();
// router.post('/login', basicLogin);
router.post('/signup', basicSignUp);
router.get('/user', auth, updateUser);

export { router as basicRouter };
