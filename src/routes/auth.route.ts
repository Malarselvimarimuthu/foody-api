// Importing packages
import { Router } from 'express';

// Importing controllers
import authController from '../controllers/auth.controller';

// Defining routers
const router = Router();

// auth routes
router.post('/login', authController.handleLogin);
router.post('/register', authController.handleRegister);


export default router;
