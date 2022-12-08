import { Router } from 'express';
import { login, signUp } from '../controllers/jwt.controller';

const router = Router();
router.post('/login', login);
router.post('/signup', signUp);

export { router as jwtRouter };
