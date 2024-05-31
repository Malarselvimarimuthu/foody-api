// auth.route.ts
// Importing packages
import { Router } from 'express';

// Importing controllers
import authController from '../controllers/auth.controller';

// Defining routers
const router = Router();

// Manual auth routes
router.post('/register', authController.handleRegister);
router.post('/manual/login', authController.handleLogin);
router.post('/google/login', authController.handleGoogleSignIn);

export default router;